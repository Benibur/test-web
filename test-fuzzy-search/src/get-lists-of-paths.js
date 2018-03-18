/*

  Will call the cb with as a parameter an array of lists on wich searches can be run.
  Each list of items corresponds to a relevant use case to test (relevance or performances)
  Usage :
    const prepareLists = require('this-file')
    const prepareLists((lists)=>{ `do what you want with the list of lists (of items)`})
  The long list is in the file /tools/path-list.json wich you must prepare yourself with path-extractor.js (cf readme)

*/

const lists = []
let   items

const prepareLists  = function (cb) {
  // get data from the the json file (/tools/path-list.json)  for the long list (last list)
  let url = 'path-list.json';
  fetch(url)
  .then(res => {
    return res.json()
  })
  .then((out) => {
    lists.push({name:`long list (${out.length} items)`, id:'longList', defaultSearch:'banque pret', items:out})
    cb(lists)
  })
  .catch(err => console.error(err));
}

// format a list of full path into [ {name:"fileName", path:"dirPath", type:"file or directory"} ]
const _format = function (items) {
  let path_list = []
  for (fullPath of items) {
    let i = fullPath.lastIndexOf('/')
    path_list.push({type:"file",path:fullPath.slice(0,i), name:fullPath.slice(i+1)})
  }
  return path_list
}

/* list 1 */
items =
[
  '/Comptabilité/Fiscal/2015 12 30 - Controle fiscal/Documents clé USB/Banque'
]
lists.push({name:'1 item for test', id:'1_items', defaultSearch:'banque pret', items:_format(items)})

/* list 2 */
items =
[
  '/Administratif/test-filesname.txt',
  '/Administratif/Bank statements/test-filesname.txt',
  '/Administratif/Bank statements/Bank Of America/test-filesname.txt',
  '/Administratif/Bank statements/Deutsche Bank/test-filesname.txt',
  '/Administratif/Bank statements/Société Générale/test-filesname.txt',
  '/Administratif/CPAM/test-filesname.txt',
  '/Administratif/EDF/test-filesname.txt',
  '/Administratif/EDF/Contrat/test-filesname.txt',
  '/Administratif/EDF/Factures/test-filesname.txt',
  '/Administratif/Emploi/test-filesname.txt',
  '/Administratif/Impôts/test-filesname.txt',
  '/Administratif/Logement/test-filesname.txt',
  '/Administratif/Logement/Loyer 158 rue de Verdun/test-filesname.txt',
  '/Administratif/Orange/test-filesname.txt',
  '/Administratif/Pièces identité/test-filesname.txt',
  '/Administratif/Pièces identité/Carte identité/test-filesname.txt',
  '/Administratif/Pièces identité/Passeport/test-filesname.txt',
  '/Administratif/Pièces identité/Permis de conduire/test-filesname.txt',
  '/Appareils photo/test-filesname.txt',
  '/Boulot/test-filesname.txt',
  '/Cours ISEN/test-filesname.txt',
  '/Cours ISEN/CIR/test-filesname.txt',
  '/Cours ISEN/CIR/LINUX/test-filesname.txt',
  '/Cours ISEN/CIR/MICROCONTROLEUR/test-filesname.txt',
  '/Cours ISEN/CIR/RESEAUX/test-filesname.txt',
  '/Cours ISEN/CIR/TRAITEMENT_SIGNAL/test-filesname.txt',
  '/Divers photo/test-filesname.txt',
  '/Divers photo/wallpapers/test-filesname.txt',
  '/Films/test-filesname.txt',
  '/Notes/test-filesname.txt',
  '/Notes/Communication/test-filesname.txt',
  '/Notes/Notes techniques/test-filesname.txt',
  '/Notes/Recrutement/test-filesname.txt',
  '/Projet appartement à Lyon/test-filesname.txt',
  '/Vacances Périgord"/test-filesname.txt'
]
lists.push({name:'23 items', id:'23_items', defaultSearch:'admin', items:_format(items)})

/* list 3 */
$A='A666'
$B='B666'
$C='C666'
$D='D666'
$$='----'

items = [
  `/ExpectedRk:_08_/D0_${$A}/D1_${$$}/D2_${$$}`,
  `/ExpectedRk:_07_/D0_${$A}/D1_${$$}`,
  `/ExpectedRk:_06_/D0_${$$}/D1_${$$}/D2_${$A}/D3.6abc_${$A}.txt`,
  `/ExpectedRk:_05_/D0_${$$}/D1_${$$}/D2_${$A}/D3.6ab_${$A}.txt`,
  `/ExpectedRk:_04_/D0_${$$}/D1_${$$}/D2_${$A}/D3.6a_${$A}.txt`,
  `/ExpectedRk:_03_/D0_${$$}/D1_${$$}/D2_${$A}/D3.6_${$A}.txt`,
  `/ExpectedRk:_02_/D0_${$$}/D1_${$$}/D2_${$A}`,
  `/ExpectedRk:_01_/D0_${$A}`]
lists.push({name:'test 1', id:'test_1', defaultSearch:'A66', items:_format(items)})

/* list 4 */
items = [
  `/ExpectedRk_16_/D0_${$$}/D1_${$$}/D2_${$$}/D3_${$A}/D4_${$$}.txt`,
  `/ExpectedRk_12_/D0_${$$}/D1_${$$}/D2_${$A}/D3.1_${$$}.txt`,
  `/ExpectedRk_13_/D0_${$$}/D1_${$$}/D2_${$A}/D3.2_${$$}.txt`,
  `/ExpectedRk_14_/D0_${$$}/D1_${$$}/D2_${$A}/D3.3_${$$}.txt`,
  `/ExpectedRk_09_/D0_${$$}/D1_${$$}/D2_${$A}/D3.4_${$A}.txt`,
  `/ExpectedRk_10_/D0_${$$}/D1_${$$}/D2_${$A}/D3.5_${$A}.txt`,
  `/ExpectedRk_11_/D0_${$$}/D1_${$$}/D2_${$A}/D3.6_${$A}.txt`,
  `/ExpectedRk_15_/D0_${$A}/D1_${$$}/D2_${$A}.txt`,
  `/ExpectedRk_08_/D0_${$$}/D1_${$A}but relevance diluted.txt`,
  `/ExpectedRk_07_/D0_${$A}7.txt`,
  `/ExpectedRk_06_/D0_${$$}/D1_${$$}/D2_${$$}/D3_${$$}/D4_${$A}.txt`,
  `/ExpectedRk_05_/D0_${$$}/D1_${$A}.txt`,
  `/ExpectedRk_04_/D0_${$A}.txt`,
  `/ExpectedRk_03_/D0_${$$}/D1_${$$}/D2_${$$}/D3_${$A}`,
  `/ExpectedRk_02_/D0_${$$}/D1_${$$}/D2_${$A}`,
  `/ExpectedRk_01_/D0_${$A}`
]
lists.push({name:'test 2', id:'test_2', defaultSearch:'A66', items:_format(items)})

/* list 5 */
items = [
  `/A0_${$$}/A1_${$$}/A2_${$A}/A3.6_${$A}.txt`,
  `/A0_${$$}/A1_${$$}/A2_${$A}/A3.6a_${$A}.txt`,
  `/A0_${$$}/A1_${$$}/A2_${$A}/A3.6ab_${$A}.txt`,
  `/A0_${$$}/A1_${$$}/A2_${$A}/A3.6abc_${$A}.txt`,
  `/A0_${$$}/A1_${$$}/A2_${$A}/A3.6abcd_${$A}.txt`,
  `/A0_${$$}/A1_${$$}/A2_${$A}/A3.6abcde_${$A}.txt`,
  `/A0_${$$}/A1_${$$}/A2_${$A}/A3.6abcdef_${$A}.txt`,
  `/A0_${$$}/A1_${$$}/A2_${$A}/A3.6abcdefg_${$A}.txt`,
  `/A0_${$$}/A1_${$$}/A2_${$A}/A3.6abcdefgh_${$A}.txt`,
  `/A0_${$$}/A1_${$$}/A2_${$A}`,
  `/B0_${$A}.txt`,
  `/B0_${$A}/B1_${$A}.txt`,
  `/B0_${$A}/B1_${$A}/B2_${$A}.txt`,
  `/B0_${$A}/B1_${$A}/B2_${$A}/B3_${$A}.txt`,
  `/B0_${$A}/B1_${$A}/B2_${$A}/B3_${$A}/B4_${$A}.txt`,
  `/C0_${$A}.txt`,
  `/C0_${$A}/C1_${$$}/C2_${$A}/C3_${$$}/C4_${$A}.txt`,
  `/C0_${$A}/C1_${$$}/C2_${$A}/C3_${$$}`,
  `/C0_${$A}/C1_${$$}/C2_${$A}.txt`,
  `/C0_${$A}/C1_${$$}`,
  `/C0_${$A}`,
  `/D0_${$D}.txt`,
  `/D0_${$D}/D1_${$$}`,
  `/D0_${$D}/D1_${$$}/D2_${$D}`,
  `/D0_${$D}/D1_${$$}/D2_${$D}/D3_${$$}`,
  `/D0_${$D}/D1_${$$}/D2_${$D}/D3_${$$}/D4_${$D}.txt`
]
lists.push({name:'test 3', id:'test_3', defaultSearch:'A66', items:_format(items)})



module.exports = prepareLists
