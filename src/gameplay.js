var factory = require('./datatypes');
var _ = require ('underscore');
var util = require('util'),
    vm = require('vm');

var storage = require('lru-cache')(400);
var queue = require('fake-queue')();


var forward = " if (cell.msgIn.length > 0) " +
"{ cell.msgOut = [{ x: cell.pos.x-1, y: cell.pos.y, content:cell.msgIn[0]}]}"
var PROG1 = " if (cell.msgIn.length > 0) { console.log(cell.msgIn[0] + ' received')}  "
var PROG2 = " cell.msgOut = [{ x: cell.pos.x-1, y:cell.pos.y, content: 'bllaaaa'}];"


exports.run = function startGame()  { 
    
    var prog = factory.prog(forward);
    storage.set(prog.storageKey,prog);
    
    forAllCells(function initCell(x,y){
        var cell = factory.cell(x,y);
        cell.installedProg=prog.storageKey;
        storage.set(cell.storageKey,cell);
    });
    
    var prog1 = factory.prog(PROG1);
    storage.set(prog1.storageKey,prog1);
    var cell1 = factory.cell(1,1);
    cell1.installedProg=prog1.storageKey;
    storage.set(cell1.storageKey,cell1);


    var prog2 = factory.prog(PROG2);
    storage.set(prog2.storageKey,prog2);
    var cell2 = factory.cell(9,1);
    cell2.installedProg=prog2.storageKey;
    storage.set(cell2.storageKey,cell2);
 
    for(var j=1;j<=9;j++){
        console.log('.');
        doStep();
    }

}; 


var doStep = function doStep(){
    forAllCells(function executeCell(x,y){
        cell = storage.get("cell:" + x + ":" + y);
        
        if(cell.installedProg) {
            
            // execute programm
            prog = storage.get(cell.installedProg);
            vm.runInNewContext(prog.source,{cell: cell, console : console});
            //cell.msgIn = [];

            // forward messages
            _.forEach(cell.msgOut,
                function transferMessages(msg){
                    if (Math.abs(msg.x - x) <= 1 && Math.abs(msg.y -y) <= 1) {
                        remoteCell = storage.get("cell:" + msg.x + ":" + msg.y);
                        remoteCell.msgIn.push(msg.content);
                        storage.set(remoteCell.storageKey,remoteCell);
                    }
                });
            //cell.msgOut=[];

            storage.set(cell.storageKey,cell);
            // foward units
            // compute cell owner / programm changes 
        } else {
            log.console("uninstalled cell");

        }

    });
}


var forAllCells = function(fun) {
    for(var i=1; i <= 10; i++){
        for(var j=1; j<= 10; j++){
            fun(i,j);               
        }
    }
}


var loadCell = function loadCell(i){
    return {
        run : function(prog) {
            vm.runInNewContext(prog, {cellid:i,console:console});
        }
    }
}



