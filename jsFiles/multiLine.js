var fs=require('fs');
var lineReader = require('readline').createInterface({
   input : fs.createReadStream('FoodFacts.csv') 
});
var i=0;
var lineRecords=[];
var isHeader = 0;
var cIndex=0,fatIndex=0,protienIndex=0,carboIndex=0;
var north = ['United Kingdom', 'Denmark', 'Sweden','Norway'];
var central  = ['France', 'Belgium', 'Germany', 'Switzerland','Netherlands'];
var South = ['Portugal', 'Greece', 'Italy', 'Spain', 'Croatia','Albania'];
var nfatData =0,nprotienData=0,ncarboData =0,cfatData =0,cprotienData =0,ccarboData =0;
var sfatData =0,sprotienData=0,scarboData=0;
var jsonArray = [];
var Europe=[];
var nobj={},cobj={},sobj={};
var sCounter=0,cCounter=0,nCounter=0;
lineReader.on('line',function(line)
{
    lineRecords = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);   // split data  line by line 
    if(isHeader==0)           // it is for fetching index of coloumn
    {
        cIndex = lineRecords.indexOf("countries_en");
        protienIndex = lineRecords.indexOf("proteins_100g");
        carboIndex = lineRecords.indexOf("carbohydrates_100g");
        fatIndex = lineRecords.indexOf("fat_100g"); 
        isHeader++;
    }   
    else{
       if(north.includes(lineRecords[cIndex])) // it is for checking north countries
       {
        var nfat = lineRecords[fatIndex].replace("",0);
        nprotien=lineRecords[protienIndex].replace("",0);
        ncarbo=lineRecords[carboIndex].replace("",0);
        nfatData+=parseFloat(nfat);
        ncarboData+=parseFloat(ncarbo);
        nprotienData+=parseFloat(nprotien);
        nCounter++;
    }
    if(central.includes(lineRecords[cIndex]))  // it is for checking central countries
    {
        var cfat = lineRecords[fatIndex].replace("",0);
        var cprotien=lineRecords[protienIndex].replace("",0);
        var ccarbo=lineRecords[carboIndex].replace("",0);
        cfatData+=parseFloat(cfat);
        cprotienData+=parseFloat(cprotien);
        ccarboData+=parseFloat(ccarbo);
        cCounter++;
    }
    if(South.includes(lineRecords[cIndex]))   // it is for checking south countries
    {
        var sfat = lineRecords[fatIndex].replace("",0);
        var sprotien=lineRecords[protienIndex].replace("",0);
        var scarbo=lineRecords[carboIndex].replace("",0);
        sfatData+=parseFloat(sfat);
        sprotienData+=parseFloat(sprotien);
        scarboData+=parseFloat(scarbo);
        sCounter++;  
    }
}});
 
lineReader.on('close',function ()       //put data into object

{ 

    nobj["regions"] = "NorthEurope";
    nobj["Fat"] = nfatData/nCounter;
    nobj["Protien"] = nprotienData/nCounter;
    nobj["carbohydrates"] = ncarboData/nCounter;
    Europe.push(nobj);
    cobj["regions"] = "CentralEurope";
    cobj["Fat"] = cfatData/cCounter;
    cobj["Protien"] = cprotienData/cCounter;
    cobj["carbohydrates"] = ccarboData/cCounter;
    Europe.push(cobj);
    sobj["regions"] = "SouthEurope";
    sobj["Fat"] = sfatData/sCounter;
    sobj["Protien"] = sprotienData/sCounter;
    sobj["carbohydrates"] = scarboData/sCounter;
    Europe.push(sobj);
    fs.writeFile('Multiline.json',JSON.stringify(Europe),'utf-8');
});
