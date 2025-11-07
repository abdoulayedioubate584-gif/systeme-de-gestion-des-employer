describe('Search and Filter Functions', () => {
  beforeEach(() => {
    global.employes = [];
    document.body.innerHTML = `
      <div id="listeEmployes"></div>
      <input id="recherche" type="text" />
      <select id="filterRole">
        <option value="">Tous</option>
        <option value="Developpeur">Développeur</option>
      </select>
    `;
  });

  describe('getVisibleEmployes', () => {
    beforeEach(() => {
      employes.push(
        new Developpeur('Alice Dev', 30, 2000000, 'JS'),
        new Manager('Bob Manager', 40, 3000000, 'Team A'),
        new Developpeur('Charlie Dev', 25, 1800000, 'Python')
      );
    });

    test('devrait filtrer par nom', () => {
      currentSearch = 'alice';
      const visible = getVisibleEmployes();
      expect(visible.length).toBe(1);
      expect(visible[0].nom).toBe('Alice Dev');
    });

    test('devrait filtrer par rôle', () => {
      currentRoleFilter = 'Developpeur';
      const visible = getVisibleEmployes();
      expect(visible.length).toBe(2);
      expect(visible.every(e => e instanceof Developpeur)).toBe(true);
    });

    test('devrait trier par nom (asc)', () => {
      sortBy = 'nom';
      sortDir = 1;
      const visible = getVisibleEmployes();
      expect(visible[0].nom).toBe('Alice Dev');
      expect(visible[2].nom).toBe('Charlie Dev');
    });

    test('devrait trier par salaire (desc)', () => {
      sortBy = 'salaire';
      sortDir = -1;
      const visible = getVisibleEmployes();
      expect(visible[0].calculerSalaire()).toBeGreaterThan(visible[1].calculerSalaire());
    });
  });

  describe('afficherListeEmployes', () => {
    test('devrait afficher "Aucun employé" si liste vide', () => {
      afficherListeEmployes();
      expect(document.getElementById('listeEmployes').innerHTML)
        .toContain('Aucun employé');
    });

    test('devrait créer un tableau avec les employés visibles', () => {
      employes.push(new Developpeur('Test Dev', 30, 2000000, 'JS'));
      afficherListeEmployes();
      const table = document.querySelector('#listeEmployes table');
      expect(table).toBeTruthy();
      expect(table.querySelector('tbody tr')).toBeTruthy();
    });
  });
});