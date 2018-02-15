function getClusterCorrelation(cars,node){
  var arr=new Array();
  for(var i=0;i<7;i++){
    arr[i]=new Array();
  }
  var dime=["AQI","PM25","PM10","SO2","NO2","O3","CO"];
  for(var i=0;i<7;i++){
    for(var k=0;k<7;k++){
      var sumik=0;
      for(var j=0;j<node[i].length;j++){
        var sumj=0;
        for(var n=0;n<cars.length;n++){
          if(node[i][j].values[0]<cars[n][dime[i]]&&node[i][j].values[1]>cars[n][dime[i]]){
            sumj++;
          }
        }
        
        for(var l=0;l<node[k].length;l++){
          var suml=0;
          for(var n=0;n<cars.length;n++){
            if(node[k][l].values[0]<cars[n][dime[k]]&&node[k][l].values[1]>cars[n][dime[k]]){
              suml++;
            }
          }
          var same=0;
          for(var m=0;m<cars.length;m++){
            if(node[i][j].values[0]<cars[m][dime[i]]&&node[i][j].values[1]>cars[m][dime[i]]&&node[k][l].values[0]<cars[m][dime[k]]&&node[k][l].values[1]>cars[m][dime[k]]){
              same++;
            }
          }
          if(same!=0)
            sumik=sumik+(-same/sumj*Math.log(same/sumj)/Math.log(2))+(-same/suml*Math.log(same/suml)/Math.log(2));
        }
      }
      arr[i][k]=sumik;
    }
  }
  return arr;
}
