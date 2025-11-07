class Employe {
  constructor(nom, age, baseSalaire) {
    this.nom = nom;
    this.age = age;
    this.baseSalaire = baseSalaire;
  }

  calculerSalaire() {
    return this.baseSalaire;
  }

  afficherDetails() {
    return `Nom : ${this.nom}<br>Âge : ${this.age}<br>Salaire : ${this.calculerSalaire()} GNF`;
  }
}

class Developpeur extends Employe {
  constructor(nom, age, baseSalaire, langage) {
    super(nom, age, baseSalaire);
    this.langage = langage;
  }

  calculerSalaire() {
    return this.baseSalaire + 500000;
  }

  afficherDetails() {
    return super.afficherDetails() + `<br>Langage : ${this.langage}`;
  }
}

class Manager extends Employe {
  constructor(nom, age, baseSalaire, equipe) {
    super(nom, age, baseSalaire);
    this.equipe = equipe.split(',').map(e => e.trim());
  }

  calculerSalaire() {
    return this.baseSalaire + this.equipe.length * 300000;
  }

  afficherDetails() {
    return super.afficherDetails() + `<br>Équipe : ${this.equipe.join(', ')}`;
  }
}

class Directeur extends Employe {
  constructor(nom, age, baseSalaire, departement) {
    super(nom, age, baseSalaire);
    this.departement = departement;
  }

  calculerSalaire() {
    return this.baseSalaire + 1000000;
  }

  afficherDetails() {
    return super.afficherDetails() + `<br>Département : ${this.departement}`;
  }
}

const employes = [];

function afficherListeEmployes() {
  const container = document.getElementById('listeEmployes');
  container.innerHTML = "";

  employes.forEach((employe, index) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <hr>
      <p>${employe.afficherDetails()}</p>
      <button onclick="supprimerEmploye(${index})">🗑 Supprimer</button>
    `;
    container.appendChild(div);
  });

  // Sauvegarde dans localStorage
  localStorage.setItem("employes", JSON.stringify(employes.map(e => ({
    nom: e.nom,
    age: e.age,
    baseSalaire: e.baseSalaire,
    role: e.constructor.name,
    extra: e.langage || e.equipe?.join(', ') || e.departement
  }))));
}


function rechercherEmploye() {
  const nomRecherche = document.getElementById('recherche').value.toLowerCase();
  const container = document.getElementById('listeEmployes');
  container.innerHTML = "";

  const resultats = employes.filter(e => e.nom.toLowerCase().includes(nomRecherche));

  if (resultats.length === 0) {
    container.innerHTML = "<p>Aucun employé trouvé.</p>";
    return;
  }

  resultats.forEach((employe) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <hr>
      <p>${employe.afficherDetails()}</p>
    `;
    container.appendChild(div);
  });
}

function supprimerEmploye(index) {
  employes.splice(index, 1);
  afficherListeEmployes();
}

document.getElementById('formEmploye').addEventListener('submit', function(e) {
  e.preventDefault();

  const nom = document.getElementById('nom').value;
  const age = parseInt(document.getElementById('age').value);
  const salaire = parseInt(document.getElementById('salaire').value);
  const role = document.getElementById('role').value;
  const extra = document.getElementById('extra').value;

  let employe;

  if (role === "Developpeur") {
    employe = new Developpeur(nom, age, salaire, extra);
  } else if (role === "Manager") {
    employe = new Manager(nom, age, salaire, extra);
  } else if (role === "Directeur") {
    employe = new Directeur(nom, age, salaire, extra);
  }

  employes.push(employe);
  afficherListeEmployes();
  this.reset();
});
window.addEventListener("load", () => {
  const data = JSON.parse(localStorage.getItem("employes")) || [];

  data.forEach(obj => {
    let employe;
    if (obj.role === "Developpeur") {
      employe = new Developpeur(obj.nom, obj.age, obj.baseSalaire, obj.extra);
    } else if (obj.role === "Manager") {
      employe = new Manager(obj.nom, obj.age, obj.baseSalaire, obj.extra);
    } else if (obj.role === "Directeur") {
      employe = new Directeur(obj.nom, obj.age, obj.baseSalaire, obj.extra);
    }
    employes.push(employe);
  });

  afficherListeEmployes();
});