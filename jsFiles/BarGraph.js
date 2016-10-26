var fs=require('fs');
var lineReader = require('readline').createInterface({
  input : fs.createReadStream('FoodFacts.csv') 
});
var i=0;
var lineRecords=[];
var isHeader = 0;
var countryIndex=0,saltIndex=0,sugarIndex=0;
var countryArray = ['Netherlands', 'Canada', 'United Kingdom' , 'United States' , 'Australia' , 'France' , 'Germany' , 'Spain', 'South Africa'];
var sugarArray = [];
var saltArray = [];
var jsonArray = [];
var count=[];

for(var i=0;i<countryArray.length;i++)  // initialise array
{
  sugarArray[i]=0;
  saltArray[i]=0;
  count[i]=0;
  
}
lineReader.on('line',function(line)
{
 lineRecords = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);  // split data  line by line 
 if(isHeader==0)      // it is for fetching index of coloumns
 {
   countryIndex = lineRecords.indexOf("countries_en");
   saltIndex = lineRecords.indexOf("salt_100g");
   sugarIndex = lineRecords.indexOf("sugars_100g");
   isHeader++;
 }    
 else if(( countryArray.includes(lineRecords[countryIndex])));    //it is for fetching all data
 {
   var index = countryArray.indexOf(lineRecords[countryIndex]);
   var salt = lineRecords[saltIndex].replace("",0);
   var sugar=lineRecords[sugarIndex].replace("",0);
   saltArray[index] = saltArray[index]+parseFloat(salt);
   sugarArray[index] = sugarArray[index]+parseFloat(sugar);
   count[index]+=1;
 }
});

lineReader.on('close',function ()
{ 
  for(var i=0;i<countryArray.length;i++)  //put data into object
  {
    var obj = {};
    obj["country"] = countryArray[i];
    obj["salt"] = saltArray[i]/count[i];
    obj["sugar"] = sugarArray[i]/count[i];
    jsonArray.push(obj);
  }
  fs.writeFile('barGraph.json', JSON.stringify(jsonArray) , 'utf-8');
})