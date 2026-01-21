My plan is to fill the tiles with tile images, from a tile map, like a classic tile builder app. However my tile set only supports 2x2 trees. Which is a  problem if I want to fill the wall tiles with trees, I need to organies the tiles on a way that 2x2 trees fit in the pattern. 

Example, 2x2 tree tile:

  ----------------------------
| left top    |  right top     |
| -----------------------------|
| left bottom |  right bottom  |
  ----------------------------

  Lets name them so you can see examles easier:
  Left top: 1
  Right top: 2
  Right bottom: 3
  left bottom: 4
  empty: 0


The tilest supports overlaping trees but with in tile indentation in each row. 

Example:

First row:    0,1,2,1,2
Secound row:  1,2,1,2,1

So this means, on the generated map, every edge should be an EVEN number.

Let me write same good and bad examples:  

GOOD:

001100
001100

001100
011110
011110
001100

011110
111111
111111
011110

0 0 0 0 0 0 0 0
0 0 1 1 1 1 0 0
0 1 1 1 1 1 1 0
0 1 1 1 1 1 1 0
0 0 1 1 1 1 0 0
0 0 0 1 1 0 0 0


BAD:

001000
011110
011110
001100

001100
011100
011110
001100

001110
011110
011110
001100

0 0 0 0 0 0 0 0
0 0 1 1 1 1 0 0
0 1 1 1 1 1 1 1
0 0 1 1 1 1 0 0
0 0 0 1 1 0 0 0

Also don't forget this should work on bigger scale, so we can't have 11,13,27 and these kind of unEven edges. 

Please implement another last map iteration on top of the existing logic, that modifies the map to satisfy this rule.
