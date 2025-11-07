describe('Import/Export Functions', () => {
  beforeEach(() => {
    // Reset employes array before each test
    global.employes = [];
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    // Mock Blob and URL
    global.Blob = jest.fn((content, options) => ({
      content,
      options
    }));
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
  });

  describe('exportJSON', () => {
    test('devrait créer un Blob JSON avec les données des employés', () => {
      const dev = new Developpeur('Alice', 30, 2000000, 'JavaScript');
      employes.push(dev);
      
      exportJSON();
      
      expect(Blob).toHaveBeenCalledWith(
        [expect.stringContaining('"nom":"Alice"')],
        { type: 'application/json' }
      );
    });
  });

  describe('exportCSV', () => {
    test('devrait créer un CSV avec en-têtes et données', () => {
      const dev = new Developpeur('Bob', 25, 1800000, 'Python');
      employes.push(dev);
      
      exportCSV();
      
      expect(Blob).toHaveBeenCalledWith(
        [expect.stringContaining('nom,age,baseSalaire,role,extra')],
        { type: 'text/csv' }
      );
    });
  });

  describe('importFromArray', () => {
    test('devrait créer des employés depuis un array JSON', () => {
      const data = [
        { nom: 'Charlie', age: 35, baseSalaire: 2500000, role: 'Developpeur', extra: 'Java' },
        { nom: 'Diana', age: 40, baseSalaire: 3000000, role: 'Manager', extra: 'Team A,Team B' }
      ];
      
      importFromArray(data);
      
      expect(employes.length).toBe(2);
      expect(employes[0]).toBeInstanceOf(Developpeur);
      expect(employes[1]).toBeInstanceOf(Manager);
    });

    test('devrait ignorer les entrées invalides', () => {
      const data = [
        { nom: 'Valid', age: 30, baseSalaire: 2000000, role: 'Developpeur', extra: 'JS' },
        { nom: 'Invalid', role: 'InvalidRole' }
      ];
      
      importFromArray(data);
      
      expect(employes.length).toBe(1);
    });
  });
});