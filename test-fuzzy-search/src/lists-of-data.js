const lists = {}
const prepareLists  = function (cb) {
  // get data from the the json file (/tools/path-list.json)
  let url = 'path-list.json';
  fetch(url)
  .then(res => {
    return res.json()
  })
  .then((out) => {
    lists.long = out
    cb(lists)
  })
  .catch(err => console.error(err));
}
// for quick tests
// lists.short =
// [{"type":"file","path":"/Administratif"},
//   {"type":"file","path":"/Administratif/Bank statements"},
//   {"type":"file","path":"/Administratif/Bank statements/Bank Of America"}
// ]
// for quick tests
lists.short =
[{"type":"file","path":"/Administratif","name":"test-filesname.txt"},
  {"type":"file","path":"/Administratif/Bank statements","name":"test-filesname.txt"},
  {"type":"file","path":"/Administratif/Bank statements/Bank Of America","name":"test-filesname.txt"},
  {"type":"file","path":"/Administratif/Bank statements/Deutsche Bank","name":"test-filesname.txt"},
  {"type":"file","path":"/Administratif/Bank statements/Société Générale","name":"test-filesname.txt"},
  {"type":"file","path":"/Administratif/CPAM","name":"test-filesname.txt"},
  {"type":"file","path":"/Administratif/EDF","name":"test-filesname.txt"},
  {"type":"file","path":"/Administratif/EDF/Contrat","name":"test-filesname.txt"},
  {"type":"file","path":"/Administratif/EDF/Factures","name":"test-filesname.txt"},
  {"type":"file","path":"/Administratif/Emploi","name":"test-filesname.txt"},
  {"type":"file","path":"/Administratif/Impôts","name":"test-filesname.txt"},
  {"type":"file","path":"/Administratif/Logement","name":"test-filesname.txt"},
  {"type":"file","path":"/Administratif/Logement/Loyer 158 rue de Verdun","name":"test-filesname.txt"},
  {"type":"file","path":"/Administratif/Orange","name":"test-filesname.txt"},
  {"type":"file","path":"/Administratif/Pièces identité","name":"test-filesname.txt"},
  {"type":"file","path":"/Administratif/Pièces identité/Carte identité","name":"test-filesname.txt"},
  {"type":"file","path":"/Administratif/Pièces identité/Passeport","name":"test-filesname.txt"},
  {"type":"file","path":"/Administratif/Pièces identité/Permis de conduire","name":"test-filesname.txt"},
  {"type":"file","path":"/Appareils photo","name":"test-filesname.txt"},
  {"type":"file","path":"/Boulot","name":"test-filesname.txt"},
  {"type":"file","path":"/Cours ISEN","name":"test-filesname.txt"},
  {"type":"file","path":"/Cours ISEN/CIR","name":"test-filesname.txt"},
  {"type":"file","path":"/Cours ISEN/CIR/LINUX","name":"test-filesname.txt"},
  {"type":"file","path":"/Cours ISEN/CIR/MICROCONTROLEUR","name":"test-filesname.txt"},
  {"type":"file","path":"/Cours ISEN/CIR/RESEAUX","name":"test-filesname.txt"},
  {"type":"file","path":"/Cours ISEN/CIR/TRAITEMENT_SIGNAL","name":"test-filesname.txt"},
  {"type":"file","path":"/Divers photo","name":"test-filesname.txt"},
  {"type":"file","path":"/Divers photo/wallpapers","name":"test-filesname.txt"},
  {"type":"file","path":"/Films","name":"test-filesname.txt"},
  {"type":"file","path":"/Notes","name":"test-filesname.txt"},
  {"type":"file","path":"/Notes/Communication","name":"test-filesname.txt"},
  {"type":"file","path":"/Notes/Notes techniques","name":"test-filesname.txt"},
  {"type":"file","path":"/Notes/Recrutement","name":"test-filesname.txt"},
  {"type":"file","path":"/Projet appartement à Lyon","name":"test-filesname.txt"},
  {"type":"file","path":"/Vacances Périgord", "name":"test-filesname.txt"}
]


module.exports = prepareLists
