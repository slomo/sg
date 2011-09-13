


on gameplay
-----------

* game is round based
* battlefield consitst of polygons (called fields)
  * every player has one special field (his start game), ha can accsess all 
    functions of this field via rest-api
  * all other fields are equal and belong to nobody at t=0
  * fields may contain units (see below)
  * fields can process a number of messages (depending on thier level)
  * some special fields may produce units
* only one ressource (called units)
  * produced by special fields
  * may be transfered between adjacent fields
  * units may be used to capture unasigned or enemycontrolled fields
  * units may be used to upgrade fields
* messages
  * may be passed between adjacent fields
  * depending on the level each round a number of k messages can be processed
  * messages are defined to be 1024 byte free form messages
* programm
  * each round a field recives a number of messages, may produce a number of 
    new messages, send units or evolve by consuming units
  * each node can run a invidual programm in an embedded language, that takes
    all this decessions
  * in whole the game will behave like a synchrone algorithm
  * fields schould save some state (maybe message that is passed between 
    different round executions)

further ideas:
* provoid some kind of spy attacks

questions:
* what happens to messsages, that are to much
* should unit transfer between cells be limited
* which order can be granted
* can units be stored on cells, that are not belong to the unit onwer

here the flow in one cell

round = t
level of cell = k

1. get k messages from queue send to this field at p < t
2. collect events (units that entered the cell, possible spy attacks,)
3. start code with messages and events (maybe ide of round)
4. send messages and units to input qeues of adjacent cells
5. wait for all other cells to terminate code in round t
6. get received units, compute cell owner (guy with most units in that cell)
7. wait to complete round on all cells goto 1

on architecture
---------------


