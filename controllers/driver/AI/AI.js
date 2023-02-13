let graph={};
// // calculate the Manhattan distance between two coordinates
const distance = (coordinat1,coordinat2) => {
  x1=coordinat1.split(',')[0];
  y1=coordinat1.split(',')[1];
  x2=coordinat2.split(',')[0];
  y2=coordinat2.split(',')[1];
  let total=Math.abs(x2-x1) + Math.abs(y2-y1);
  // let total=Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  total=Math.pow(10,total);
  total=Math.pow(10,total);
  return parseInt(total); 
};

const dijikstra=(locations)=>{    
    // calcCostOfParks        
    // coordinate,park
    let indexGraph=0;
    for(i=0;i<locations.length;i++){
        let park=locations[i].park;
        for(j=0;j<locations.length;j++){
              if(j==0)
                 graph[park]=[];
              if(locations[i]!=locations[j]){
                      graph[park][indexGraph]=
                        [locations[j].park,distance(locations[i].coordinate,locations[j].coordinate)];
                        indexGraph++;      
              }

        }
        indexGraph=0;
    }
    let path=[];indexGraph=0;let startNode;
    for(let i in graph){
        startNode=i;
        break;
      }
      path[indexGraph]=startNode;
      indexGraph++;let locationName="";
      for(let i in graph){
        if(locationName!==""){
           i=locationName;
           locationName="";
          }
        let help=10000;
        for(j=0;j<graph[i].length;j++){
            if(path.includes(graph[i][j][0])){
                 continue;
            }else if(help>graph[i][j][1]){
                 help=graph[i][j][1];
                 locationName=graph[i][j][0];
                }
            }
        if(locationName!==""){
          path[indexGraph]=locationName;
          indexGraph++;
        }
      }
      locations.forEach(i=>{
        for(j=0;j<path.length;j++)
              if(i.park==path[j]){
                  path[j]={ coordinate: i.coordinate, park: i.park };  
                  break;  
              }
      });
      return path;
}

module.exports={
  dijikstra
};