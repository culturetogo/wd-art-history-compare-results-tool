console.log("JS!");
// var set1 = ["Result 1", "Result 2", "Result 4"];
// var set2 = ["Result 1", "Result 2", "Result 3","Result 5"];
var list1 = [];
var list2 = [];
var lists = [list1, list2];

var artist ="Q160538";

var endpointUrl = 'https://query.wikidata.org/sparql';
var sparqlQuery1 = "#Kunsterke eines Künstlers mit und ohne Einschränkung auf Unterkklasse von Kunstwerk\n" +
        "\n" +
        "SELECT DISTINCT ?item ?itemLabel \n" +
        "WHERE \n" +
        "{\n" +
        "  VALUES ?artist {wd:" + artist + "}\n" +
        "  ?item wdt:P170 ?artist .\n" +
        "  SERVICE wikibase:label { bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". }\n" +
        "}\n" +
        "\n" +
        "ORDER BY ?item";
var sparqlQuery2 = "#Kunsterke eines Künstlers mit und ohne Einschränkung auf Unterkklasse von Kunstwerk\n" +
        "\n" +
        "SELECT DISTINCT ?item ?itemLabel \n" +
        "WHERE \n" +
        "{\n" +
        "  VALUES ?artist {wd:" + artist + "}\n" +
        "  ?item wdt:P31/wdt:P279* wd:Q838948 ;\n" +
        "        wdt:P170 ?artist .\n" +
        "  SERVICE wikibase:label { bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". }\n" +
        "}\n" +
        "\n" +
        "ORDER BY ?item";
var settings1 = {
        headers: { Accept: 'application/sparql-results+json' },
        data: { query: sparqlQuery1 }
    };
var settings2 = {
        headers: { Accept: 'application/sparql-results+json' },
        data: { query: sparqlQuery2 }
    };
var settings = [settings1, settings2];

// gibt jeweils die Elemente einer Liste aus, die nicht in der anderen Liste vorkommen
function wdDiffSep(set1,set2) {
  var res1 = [];
  var res2 = [];
  for(var x = 0; x < set1.length; x++){
    if(set2.indexOf(set1[x]) == -1) {
      res1.push(set1[x]);
    }
  };
  for(var y = 0; y < set2.length; y++){
    if(set1.indexOf(set2[y]) == -1) {
      res2.push(set2[y]);
    }
  };
  var re = /Q\d+/;
  var output1 ='<ul>';
  for(var i = 0; i < res1.length; i++) {
    var s1 = res1[i];
    var as1 = s1.match(re)[0];
    output1 += '<li><a onclick="markLink(event)"  href="' + s1 + '" target="_blank">' + as1 + '</a></li>';
  };
  output1 += '</ul>';
  var output2 ='<ul>';
  for(var j = 0; j < res2.length; j++) {
    var s2 = res1[j];
    var as2 = s2.match(re)[0];
    output1 += '<li><a onclick="markLink(event)"  href="' + s2 + '" target="_blank">' + as2 + '</a></li>';
  };
  output2 += '</ul>';
  document.getElementById("erg1").innerHTML = output1;
  document.getElementById("erg2").innerHTML = output2;
  document.getElementById("countErg1").innerHTML = res1.length + " Einträge";
  document.getElementById("countErg2").innerHTML = res2.length + " Einträge";
}
function listResult(resdat) {
    var output = '<ul>';
    for(var i = 0; i < resdat.length; i++){
      var s = resdat[i];
      var re = /Q\d+/;
      var as = s.match(re)[0];
      output += '<li><a onclick="markLink(event)"  href="' + s + '" target="_blank">' + as + '</a></li>';
    }
    output += '</ul>';
    return output;
}
function getWDJSON() {
  getWDJSONData('1');
  getWDJSONData('2');
}
function getWDJSONData(n) {
  var countElement = document.getElementById('countResult' + n);
  var resultElement = document.getElementById('getResult' + n);
  countElement.innerHTML = '';
  resultElement.innerHTML = '';
  var num = (n * 1) - 1;
  lists[num] = [];
  var currList = lists[num];
  var currSettings = settings[num];
  $.ajax( endpointUrl, currSettings ).then( function ( data ) {
      var items = data.results.bindings;
      for(var i = 0; i < items.length; i++){
        currList.push(items[i].item.value);
      }
      wdDiffSep(lists[0],lists[1]);
      countElement.innerHTML = currList.length + " Einträge";
      resultElement.innerHTML = listResult(currList);
  } )
}
function markLink(e){
  e.target.classList.add("small");
}
