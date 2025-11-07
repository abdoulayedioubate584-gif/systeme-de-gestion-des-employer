// Test des classes d'employés
describe('Classes Employés', () => {
  describe('Employe', () => {
    test('devrait calculer le salaire de base', () => {
      const employe = new Employe('Test', 25, 1000000);
      expect(employe.calculerSalaire()).toBe(1000000);
    });
  });

  describe('Developpeur', () => {
    test('devrait ajouter 500000 au salaire de base', () => {
      const dev = new Developpeur('Dev', 30, 2000000, 'JavaScript');
      expect(dev.calculerSalaire()).toBe(2500000);
    });

    test('devrait stocker le langage', () => {
      const dev = new Developpeur('Dev', 30, 2000000, 'Python');
      expect(dev.langage).toBe('Python');
    });
  });

  describe('Manager', () => {
    test('devrait calculer le bonus selon la taille de l\'équipe', () => {
      const manager = new Manager('Boss', 40, 3000000, 'Alice, Bob, Charlie');
      expect(manager.calculerSalaire()).toBe(3900000); // 3000000 + (3 * 300000)
    });

    test('devrait parser l\'équipe en array', () => {
      const manager = new Manager('Boss', 40, 3000000, 'Alice,Bob');
      expect(manager.equipe).toEqual(['Alice', 'Bob']);
    });
  });

  describe('Directeur', () => {
    test('devrait ajouter 1000000 au salaire de base', () => {
      const dir = new Directeur('CEO', 45, 5000000, 'R&D');
      expect(dir.calculerSalaire()).toBe(6000000);
    });
  });
});