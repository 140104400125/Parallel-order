(function(mds) {
    "use strict";
    /// given a matrix of distances between some points, returns the
    /// point coordinates that best approximate the distances using
    /// classic multidimensional scaling
    mds.classic = function(distances, dimensions) {
        dimensions = dimensions || 2;

        // square distances
        var M = numeric.mul(-0.5, numeric.pow(distances, 2));

        // double centre the rows/columns
        function mean(A) { return numeric.div(numeric.add.apply(null, A), A.length); }
        //console.log(M);
        var rowMeans = mean(M);
        //console.log(rowMeans);
        var colMeans = mean(numeric.transpose(M));
        //console.log(colMeans);
        var totalMean = mean(rowMeans);
        //console.log(totalMean);

        for (var i = 0; i < M.length; ++i) {
            for (var j =0; j < M[0].length; ++j) {
                M[i][j] += totalMean - rowMeans[i] - colMeans[j];
            }
        }

        // take the SVD of the double centred matrix, and return the
        // points from it
        var ret = numeric.svd(M),
            eigenValues = numeric.sqrt(ret.S);
        return ret.U.map(function(row) {
            return numeric.mul(row, eigenValues).splice(0, dimensions);
        });
    };

    /// draws a scatter plot of points, useful for displaying the output
    /// from mds.classic etc
    mds.drawD3ScatterPlot = function(element, xPos, yPos, labels, params,cars,val,dataLoad,miserables) {
        params = params || {};
        var padding = params.padding || 150,
            // w = params.w || Math.min(720, document.documentElement.clientWidth - padding),
            // h = params.h || w,
            w = 360,
            h = 330,
            xDomain = [Math.min.apply(null, xPos),
                       Math.max.apply(null, xPos)],
            yDomain = [Math.max.apply(null, yPos),
                       Math.min.apply(null, yPos)],
            pointRadius = params.pointRadius || 5;

        if (params.reverseX) {
            xDomain.reverse();
        }
        if (params.reverseY) {
            yDomain.reverse();
        }

        var xScale = d3.scale.linear().
                domain(xDomain)
                .range([padding, w - padding]),

            yScale = d3.scale.linear().
                domain(yDomain)
                .range([padding, h-padding]);

            // xAxis = d3.svg.axis()
            //     .scale(xScale)
            //     .orient("bottom")
            //     .ticks(15),
            //     // .ticks(params.xTicks || 7),
            //
            // yAxis = d3.svg.axis()
            //     .scale(yScale)
            //     .orient("left")
            //    .ticks(params.yTicks || 7);
        element.selectAll("#node-lable").remove();
        element.selectAll("#node-circle").remove();
        element.selectAll("#arrow-line").remove();
        element.selectAll("texts").remove();
        
        var svg = element.append("g")
                .attr("width", 360)
                .attr("height", 300)
                .attr("transform","translate(130,-80)");
        var defs = svg.append("defs");

        var arrowMarker = defs.append("marker")
                                .attr("id","arrow")
                                .attr("markerUnits","strokeWidth")
                                .attr("markerWidth","12")
                                .attr("markerHeight","12")
                                .attr("viewBox","0 0 12 12") 
                                .attr("refX","6")
                                .attr("refY","6")
                                .attr("orient","auto");

        var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
                                
        arrowMarker.append("path")
                    .attr("d",arrow_path)
                    .attr("fill","#000");

        //var data=[[10,10],[20,30],[30,40],[50,60],[70,80]];
    console.log(val);
        for(var i=0;i<labels.length-1;i++){
            if(Math.abs(xScale(xPos[val[i]])-xScale(xPos[val[i+1]]))<=5&&Math.abs(yScale(yPos[val[i]])-yScale(yPos[val[i+1]]))<=5)
                continue;
            var endArrow=getArrow(xScale(xPos[val[i]]),yScale(yPos[val[i]])+20,xScale(xPos[val[i+1]]),yScale(yPos[val[i+1]])+20);
            console.log(yPos);
            var line = svg.append("line")
                .attr("class","line-mds")
                .attr("id","arrow-line")
                 .attr("x1",endArrow[0])
                 .attr("y1",endArrow[1])
                 .attr("x2",endArrow[2])
                 .attr("y2",endArrow[3])
                 .attr("stroke-width",2)
                 .attr("marker-end","url(#arrow)")
                 .attr("transform","translate(0,80)");
            console.log("x"+xScale(xPos[i]));
        }

        var nodes = svg.selectAll("circle")
            .data(labels)
            .enter()
            .append("g")
            .attr("id","node-lable")
            .attr("transform","translate(0,80)")
        
        nodes.append("circle")
            .attr("class","mdsCircle")
            .attr("r", pointRadius)
            .attr("id", "node-circle")
            .attr("cx", function(d, i) { console.log("x1"+xScale(xPos[i]));return xScale(xPos[i]); })
            .attr("cy", function(d, i) { return yScale(yPos[i])+20; })
            .attr("stroke","black")
            .style("fill",function (d,i) {
                /*var index=i+1;
                if(index==5||index==20||index==35||index==50)
                    return "#BEAED4";
                else if(index<5||(index>15&&index<20)||(index>30&&index<35)||(index>45&&index<50))
                    return "#7FC97F";
                else if((index>5&&index<16)||(index>20&&index<31))
                    return "#FDC084";
                else*/
                    return "#BEAED4";
            })
        
        var texts=nodes.append("text")
            .attr("id",function (d,i) {
                return "text"+i;
            })
            .attr("text-anchor", "middle")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return xScale(xPos[i]); })
            .attr("y", function(d, i) { return yScale(yPos[i]) - 2 *pointRadius+20; })
            .style("visibility","visible")
        nodes.on("click",function (d,i) {
            console.log(cars);
            d3.selectAll(".background").remove();
            d3.selectAll(".foreground").remove();
            d3.selectAll(".dimension").remove();
            d3.selectAll(".column").remove();
            d3.selectAll(".row").remove();
            element.selectAll("#arrow-line").remove();
            //console.log(treeData);
            var val;
            if(select_type=="name"||select_type=="Cluster")
                val=drawparallel(cars,arrMDS_cluster,i);
            else
                val=drawparallel(cars,arrMDS_relation,i);
            for(var i=0;i<labels.length-1;i++){
            if(Math.abs(xScale(xPos[val[i]])-xScale(xPos[val[i+1]]))<=5&&Math.abs(yScale(yPos[val[i]])-yScale(yPos[val[i+1]]))<=5)
                continue;
            var endArrow=getArrow(xScale(xPos[val[i]]),yScale(yPos[val[i]])+20,xScale(xPos[val[i+1]]),yScale(yPos[val[i+1]])+20);
              console.log(endArrow);
              var line = svg.append("line")
                  .attr("class","line-mds")
                  .attr("id","arrow-line")
                   .attr("x1",endArrow[0])
                     .attr("y1",endArrow[1])
                   .attr("x2",endArrow[2])
                   .attr("y2",endArrow[3])
                   .attr("stroke-width",2)
                   .attr("marker-end","url(#arrow)")
                   .attr("transform","translate(0,80)");
              console.log("x"+xScale(xPos[i]));
          }
            if(select_type=="name"||select_type=="Cluster")
                CoOccurrence(arrMDS_cluster,val);
            else{
                CoOccurrence(arrMDS_relation,val);
            }
          //console.log(year);
        })

        function partionDraw(){
    
            for(var i=0;i<dimension.length;i++){
                if(dimension[i]=="CO"){
                    treeData[i]=dataLoad[6];
                }
                if(dimension[i]=="O3"){
                    treeData[i]=dataLoad[5];
                }
                if(dimension[i]=="NO2"){
                    treeData[i]=dataLoad[4];
                }
                if(dimension[i]=="SO2"){
                    treeData[i]=dataLoad[3];
                }
                if(dimension[i]=="PM10"){
                    treeData[i]=dataLoad[2];
                }
                if(dimension[i]=="PM25"){
                    treeData[i]=dataLoad[1];
                }
                if(dimension[i]=="AQI"){
                    treeData[i]=dataLoad[0];
                }
            }
            var startx=505;
            for(var i=0;i<dimension.length;i++){
                if(dimension[i]=="CO"){
                    drawPartition(dataLoad[6],cars,startx,i,percent7,x,treeData);
                }
                if(dimension[i]=="O3"){
                    drawPartition(dataLoad[5],cars,startx,i,percent6,x,treeData);
                }
                if(dimension[i]=="NO2"){
                    drawPartition(dataLoad[4],cars,startx,i,percent5,x,treeData);
                }
                if(dimension[i]=="SO2"){
                    drawPartition(dataLoad[3],cars,startx,i,percent4,x,treeData);
                }
                if(dimension[i]=="PM10"){
                    drawPartition(dataLoad[2],cars,startx,i,percent3,x,treeData);
                }
                if(dimension[i]=="PM25"){
                    drawPartition(dataLoad[1],cars,startx,i,percent2,x,treeData);
                }
                if(dimension[i]=="AQI"){
                    drawPartition(dataLoad[0],cars,startx,i,percent1,x,treeData);
                }
                startx=startx+118;
            }
        }
        function drawparallel(cars,arrMDS_cluster,start){
            //console.log(arrMDS_cluster);
            var val=getPath(arrMDS_cluster,start);
            /*var val;
            if(select_type=="name"||select_type=="Cluster")
                val=getPath(arrMDS_cluster,start);
            else{
                val=getPath(arrMDS_relation,start);
            }*/
            for(var i=0;i<7;i++)
               dimensions[i]=dime[val[i]];
            x.domain(dimensions);
          dimension=dimensions;
          partionDraw();
          background = g1.append("g")
            .attr("class", "background")
          .selectAll("path")
            .data(cars)
          .enter().append("path")
            .attr("d", path);

          // Add blue foreground lines for focus.
          foreground = g1.append("g")
            .attr("class", "foreground")
          .selectAll("path")
            .data(cars)
          .enter().append("path")
            .attr("d", path);
          // Add a group element for each dimension.
          var g = g1.selectAll(".dimension")
            .data(dimensions)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("stroke-width",3)
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
            .call(d3.behavior.drag()
            .origin(function(d) { return {x: x(d)}; })
            .on("dragstart", function(d) {
                console.log(d);
              dragging[d] = x(d);
              background.attr("visibility", "hidden");
            })
            .on("drag", function(d) {
              dragging[d] = Math.min(width, Math.max(0, d3.event.x));
              foreground.attr("d", path);
              dimensions.sort(function(a, b) { return position(a) - position(b); });
              console.log(dimensions);
              x.domain(dimensions);
              dimension=dimensions;
              partionDraw();
              g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
            })
            .on("dragend", function(d) {
              delete dragging[d];
              transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
              transition(foreground).attr("d", path);
              background
                .attr("d", path)
              .transition()
                .delay(500)
                .duration(0)
                .attr("visibility", null);
            }));

          // Add an axis and title.
          g.append("g")
            .attr("class", "axis")
            .each(function(d) { d3.select(this).call(axis.scale(y[d]).tickValues(y[d].domain()).orient("right")); })
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function(d,i) { return d; });
        
             g.selectAll("tick").remove();

          // Add and store a brush for each axis.
          g.append("g")
            .attr("class", "brush")
            .each(function(d) {
            d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
            })
          .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);
            return val;
        }
        function CoOccurrence(matrixData,x_domain){
            var matrix = [],
              nodes = miserables.nodes,
              n = nodes.length;

          // Compute index per node.
          nodes.forEach(function(node, i) {
            node.index = i;
            node.count = 0;
            matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
          });

          // Convert links to matrix; count character occurrences.
          miserables.links.forEach(function(link) {
            nodes[link.source].count += link.value;
            nodes[link.target].count += link.value;
          });
          var max=-1,min=1000000;
          for(var i=0;i<7;i++){
            for(var j=0;j<7;j++){
                if(matrixData[i][j]>max)
                    max=matrixData[i][j];
                if(matrixData[i][j]<min)
                    min=matrixData[i][j];
                //matrix[i][j].z = arrMDS_cluster[i][j];
            }
          }
          for(var i=0;i<7;i++){
            for(var j=0;j<7;j++){
                matrix[i][j].z = (matrixData[i][j]-min)/(max-min);
            }
          }

          // Precompute the orders.
          // The default sort order.
          x1.domain(x_domain);





          g3.append("rect")
              .attr("class", "background")
              .attr("width", 200)
              .attr("height", 200);

          var row = g3.selectAll(".row")
              .data(matrix)
              .enter().append("g")
              .attr("class", "row")
              .attr("transform", function(d, i) { return "translate(0," + x1(i) + ")"; })
              .each(row);

          row.append("line")
              .attr("x2", 200);

          row.append("text")
              .attr("x", -6)
              .attr("y", x1.rangeBand() / 2)
              .attr("dy", ".32em")
              .attr("text-anchor", "end")
              .text(function(d, i) { return nodes[i].name; });

          var column = g3.selectAll(".column")
              .data(matrix)
              .enter().append("g")
              .attr("class", "column")
              .attr("transform", function(d, i) { return "translate(" + x1(i) + ")rotate(-90)"; });

          column.append("line")
              .attr("x1", -200);

          column.append("text")
              .attr("x", 6)
              .attr("y", x1.rangeBand() / 2)
              .attr("dy", ".32em")
              .attr("text-anchor", "end")
              //.attr("transform", "translate(" + -230 + "," + 0 + ")")
              .attr("transform", function(d, i) { return "translate(" + -210 + ")"; })
              .text(function(d, i) { return nodes[i].name; });

          function row(row) {
            var cell = d3.select(this).selectAll(".cell")
                .data(row.filter(function(d) { return d.z; }))
              .enter().append("rect")
                .attr("class", "cell")
                .attr("x", function(d) { return x1(d.x); })
                .attr("width", x1.rangeBand())
                .attr("height", x1.rangeBand())
                //.style("fill-opacity", function(d) { return z(d.z); })
                .style("fill", function(d,i) {
                  if(d.z>=0.5){
                    return Scale_CO1(ScaleCO2(d.z));
                  }
                  else{
                    return Scale_CO2(ScaleCO1(d.z));
                  }
                  
                  return Scale_red(d.z);
                })
                .on("mouseover", mouseover)
                .on("mouseout", mouseout);
          }

          function mouseover(p) {
            d3.selectAll(".row text").classed("active", function(d, i) { console.log("y:"+p.y);return i == p.y; });
            d3.selectAll(".column text").classed("active", function(d, i) { console.log("x:"+p.x);return i == p.x; });
          }

          function mouseout() {
            d3.selectAll("text").classed("active", false);
          }

          
        }
    };
    
    function getArrow(x1,y1,x2,y2){
        var PI=3.1415926;
        var line_length=Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
        var cosArrow;
        if(line_length==0)
          cosArrow=0;
        else
            cosArrow=(x2-x1)/line_length;
        var angle;
        if(x2-x1>=0&&y2-y1>=0)
            angle=Math.acos(cosArrow);
        else if(x2-x1<=0&&y2-y1>=0)
            angle=Math.acos(cosArrow);
        else if(x2-x1<=0&&y2-y1<=0)
            angle=2*PI-Math.acos(cosArrow);
        else if(x2-x1>=0&&y2-y1<=0)
            angle=2*PI-Math.acos(cosArrow);
        var end_arrow=[];
        console.log(angle);
        end_arrow[0]=x1+10*Math.cos(angle);
        end_arrow[1]=y1+10*Math.sin(angle);
        end_arrow[2]=x1+(line_length-15)*Math.cos(angle);
        end_arrow[3]=y1+(line_length-15)*Math.sin(angle);
        console.log(end_arrow);
        return end_arrow;
    }
    function getPath(MDS_array,startPoint){
    var flag1=new Array();
    var vis1=new Array();
    var v1=new Array();
    var array=MDS_array;
    console.log(MDS_array);
      var ans1=100000;
      flag1[startPoint]=1;
      dfs1(startPoint,0,0);

    return v1;

    function dfs1(x,len,dep){
      vis1[dep] = x;
      if (dep == 6)
      {
        if (ans1 > len)
        {
          ans1 = len;
          for (var i = 0; i < 7; i++)
            v1[i] = vis1[i];
        }//统计答案
        return;
      }
      for (var i = 0; i < 7; i++)
      {
        if (flag1[i]==1) continue; //走过不走
        flag1[i] = 1;
        dfs1(i, len + array[x][i], dep + 1);
        flag1[i] = 0;
      }
    }
  }
    
}(window.mds = window.mds || {}));

