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
// UI state for filtering & sorting
let currentSearch = '';
let currentRoleFilter = '';
let sortBy = null; // field name
let sortDir = 1; // 1 asc, -1 desc

function getVisibleEmployes() {
  let visible = employes.slice();
  // filter by search
  if (currentSearch && currentSearch.trim() !== '') {
    const s = currentSearch.toLowerCase();
    visible = visible.filter(e => (e.nom || '').toLowerCase().includes(s));
  }
  // filter by role
  if (currentRoleFilter && currentRoleFilter !== '') {
    visible = visible.filter(e => e.constructor.name === currentRoleFilter);
  }
  // sort
  if (sortBy) {
    visible.sort((a, b) => {
      let va, vb;
      switch (sortBy) {
        case 'nom': va = (a.nom || '').toLowerCase(); vb = (b.nom || '').toLowerCase(); break;
        case 'age': va = Number(a.age || 0); vb = Number(b.age || 0); break;
        case 'salaire': va = Number(a.calculerSalaire ? a.calculerSalaire() : a.baseSalaire || 0); vb = Number(b.calculerSalaire ? b.calculerSalaire() : b.baseSalaire || 0); break;
        case 'role': va = (a.constructor.name || '').toLowerCase(); vb = (b.constructor.name || '').toLowerCase(); break;
        default: va = a[sortBy]; vb = b[sortBy];
      }
      if (va < vb) return -1 * sortDir;
      if (va > vb) return 1 * sortDir;
      return 0;
    });
  }
  return visible;
}

function afficherListeEmployes() {
  const container = document.getElementById('listeEmployes');
  container.innerHTML = "";

  const visible = getVisibleEmployes();

  if (visible.length === 0) {
    container.innerHTML = "<p>Aucun employé.</p>";
    // Mettre à jour localStorage même si vide
    localStorage.setItem("employes", JSON.stringify(employes.map(e => ({
      nom: e.nom,
      age: e.age,
      baseSalaire: e.baseSalaire,
      role: e.constructor.name,
      extra: e.langage || e.equipe?.join(', ') || e.departement
    }))));
    return;
  }

  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>#</th>
        <th class="sortable" data-field="nom">Nom</th>
        <th class="sortable" data-field="age">Âge</th>
        <th class="sortable" data-field="salaire">Salaire (GNF)</th>
        <th class="sortable" data-field="role">Rôle</th>
        <th>Info</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody');

  visible.forEach((employe, idx) => {
    const tr = document.createElement('tr');
    const role = employe.constructor.name;
    const extra = employe.langage || (employe.equipe && employe.equipe.join(', ')) || employe.departement || '';
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${employe.nom}</td>
      <td>${employe.age}</td>
      <td>${employe.calculerSalaire()}</td>
      <td>${role}</td>
      <td>${extra}</td>
      <td><button class="delete-btn" onclick="supprimerEmploye(${employes.indexOf(employe)})">🗑 Supprimer</button></td>
    `;
    tbody.appendChild(tr);
  });

  container.appendChild(table);

  // attach sorting handlers and update header classes
  table.querySelectorAll('th.sortable').forEach(th => {
    const field = th.dataset.field;
    th.onclick = () => toggleSort(field);
    th.classList.remove('sort-asc', 'sort-desc');
    if (sortBy === field) th.classList.add(sortDir === 1 ? 'sort-asc' : 'sort-desc');
  });

  // Sauvegarde dans localStorage (full list)
  localStorage.setItem("employes", JSON.stringify(employes.map(e => ({
    nom: e.nom,
    age: e.age,
    baseSalaire: e.baseSalaire,
    role: e.constructor.name,
    extra: e.langage || e.equipe?.join(', ') || e.departement
  }))));
}


function rechercherEmploye() {
  currentSearch = document.getElementById('recherche').value || '';
  afficherListeEmployes();
}

function supprimerEmploye(index) {
  showConfirm('Confirmer la suppression de cet employé ?', () => {
    employes.splice(index, 1);
    afficherListeEmployes();
    showMessage('Employé supprimé.', 'success');
  });
}

document.getElementById('formEmploye').addEventListener('submit', function(e) {
  e.preventDefault();

  const nom = document.getElementById('nom').value;
  const age = parseInt(document.getElementById('age').value);
  const salaire = parseInt(document.getElementById('salaire').value);
  const role = document.getElementById('role').value;
  const extra = document.getElementById('extra').value;

  // Validation simple
  clearMessage();
  if (!nom || nom.trim().length === 0) {
    showMessage('Le nom est requis.', 'error');
    return;
  }
  if (isNaN(age) || age <= 0) {
    showMessage('Merci de saisir un âge valide.', 'error');
    return;
  }
  if (isNaN(salaire) || salaire < 0) {
    showMessage('Merci de saisir un salaire de base valide.', 'error');
    return;
  }

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
  showMessage('Employé ajouté avec succès.', 'success');
  this.reset();
});

/** Affiche un message (type: 'error'|'success') dans #message */
function showMessage(text, type) {
  const el = document.getElementById('message');
  if (!el) return;
  el.textContent = text;
  el.className = type === 'error' ? 'msg-error' : 'msg-success';
  // Supprimer le message après 3.5s
  setTimeout(() => {
    clearMessage();
  }, 3500);
}

function clearMessage() {
  const el = document.getElementById('message');
  if (!el) return;
  el.textContent = '';
  el.className = '';
}
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

// --- Toolbar: export/import/clear functionality ---
document.addEventListener('DOMContentLoaded', () => {
  const btnExportJSON = document.getElementById('btnExportJSON');
  const btnExportCSV = document.getElementById('btnExportCSV');
  const inputImport = document.getElementById('inputImportFile');
  const btnImport = document.getElementById('btnImport');
  const btnExportSample = document.getElementById('btnExportSample');
  const btnClearAll = document.getElementById('btnClearAll');

  if (btnExportJSON) btnExportJSON.addEventListener('click', exportJSON);
  if (btnExportCSV) btnExportCSV.addEventListener('click', exportCSV);
  if (btnExportSample) btnExportSample.addEventListener('click', exportSample);
  if (btnClearAll) btnClearAll.addEventListener('click', () => {
    showConfirm('Supprimer tous les employés ? Cette action est irréversible.', () => {
      employes.length = 0;
      localStorage.removeItem('employes');
      afficherListeEmployes();
      showMessage('Tous les employés ont été supprimés.', 'success');
    });
  });

  if (btnImport && inputImport) {
    btnImport.addEventListener('click', () => inputImport.click());
    inputImport.addEventListener('change', handleImportFile);
  }

  // Modal buttons
  const confirmYes = document.getElementById('confirmYes');
  const confirmNo = document.getElementById('confirmNo');
  if (confirmNo) confirmNo.addEventListener('click', () => closeConfirm());
  if (confirmYes) confirmYes.addEventListener('click', () => {
    if (typeof window.__confirmCallback === 'function') {
      window.__confirmCallback();
    }
    closeConfirm();
  });

  // live search
  const searchEl = document.getElementById('recherche');
  if (searchEl) searchEl.addEventListener('input', (ev) => {
    currentSearch = ev.target.value || '';
    afficherListeEmployes();
  });

  // role filter
  const filterRole = document.getElementById('filterRole');
  if (filterRole) filterRole.addEventListener('change', (ev) => {
    currentRoleFilter = ev.target.value || '';
    afficherListeEmployes();
  });
});

function exportJSON() {
  const data = employes.map(e => ({
    nom: e.nom,
    age: e.age,
    baseSalaire: e.baseSalaire,
    role: e.constructor.name,
    extra: e.langage || e.equipe?.join(', ') || e.departement
  }));
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'employes-export.json');
}

function exportCSV() {
  const rows = [['nom','age','baseSalaire','role','extra']];
  employes.forEach(e => {
    rows.push([e.nom, e.age, e.baseSalaire, e.constructor.name, e.langage || (e.equipe && e.equipe.join(';')) || e.departement || '']);
  });
  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  downloadBlob(blob, 'employes-export.csv');
}

function exportSample() {
  // create a small sample
  const sample = [
    { nom: 'Alice', age: 30, baseSalaire: 2000000, role: 'Developpeur', extra: 'JavaScript' },
    { nom: 'Bob', age: 40, baseSalaire: 3000000, role: 'Manager', extra: 'Equipe A,Equipe B' }
  ];
  const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'employes-sample.json');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function toggleSort(field) {
  if (sortBy === field) {
    sortDir = -sortDir;
  } else {
    sortBy = field;
    sortDir = 1;
  }
  afficherListeEmployes();
}

function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const text = ev.target.result;
    try {
      if (file.name.toLowerCase().endsWith('.json')) {
        const data = JSON.parse(text);
        importFromArray(data);
      } else if (file.name.toLowerCase().endsWith('.csv')) {
        const lines = text.split(/\r?\n/).filter(Boolean);
        const arr = [];
        const headers = lines[0].split(/,|;/).map(h => h.replace(/(^\"|\"$)/g, '').trim());
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(/,\s*/).map(c => c.replace(/(^\"|\"$)/g, '').trim());
          const obj = {};
          headers.forEach((h, idx) => obj[h] = cols[idx] || '');
          arr.push(obj);
        }
        importFromArray(arr);
      } else {
        showMessage('Format de fichier non supporté.', 'error');
      }
    } catch (err) {
      console.error(err);
      showMessage('Erreur lors de l\'import: fichier invalide.', 'error');
    }
  };
  reader.readAsText(file);
  // reset input
  e.target.value = '';
}

function importFromArray(arr) {
  if (!Array.isArray(arr)) {
    showMessage('Format d\'import invalide.', 'error');
    return;
  }
  let count = 0;
  arr.forEach(obj => {
    try {
      const role = obj.role || obj.Role || 'Developpeur';
      const nom = obj.nom || obj.Nom || obj.name || '';
      const age = parseInt(obj.age || obj.Age || 0);
      const baseSalaire = parseInt(obj.baseSalaire || obj.baseSalary || obj.salaire || 0);
      const extra = obj.extra || obj.langage || obj.departement || obj.equipe || '';
      let employe;
      if (role === 'Developpeur') employe = new Developpeur(nom, age, baseSalaire, extra);
      else if (role === 'Manager') employe = new Manager(nom, age, baseSalaire, extra);
      else if (role === 'Directeur') employe = new Directeur(nom, age, baseSalaire, extra);
      else employe = new Employe(nom, age, baseSalaire);
      employes.push(employe);
      count++;
    } catch (err) {
      // skip bad rows
    }
  });
  if (count > 0) {
    afficherListeEmployes();
    showMessage(`${count} employé(s) importé(s) avec succès.`, 'success');
  } else {
    showMessage('Aucun employé importé.', 'error');
  }
}

// --- Confirmation modal helpers ---
function showConfirm(text, callback) {
  const modal = document.getElementById('confirmModal');
  const confirmText = document.getElementById('confirmText');
  if (!modal || !confirmText) {
    // fallback
    if (confirm(text)) callback();
    return;
  }
  confirmText.textContent = text;
  modal.setAttribute('aria-hidden', 'false');
  window.__confirmCallback = callback;
}

function closeConfirm() {
  const modal = document.getElementById('confirmModal');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  window.__confirmCallback = null;
}window.isDemo = true;
