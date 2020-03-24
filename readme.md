# Tetris realization with DOM elements using Bootstrap and JQuery
In this version of Tetris the blocks are made of HTML divs and the game physics is emulated by rearranging or repainting divs with JQuery functions. 
* The grid consists of 12 '.col-1' columns with 12 divs in each one. That way, all divs in one column are siblings and exchanging adjacent divs with JQuery before() can be used to emulate falling.
* Any figure is represented internally as a JQuery collection of divs. Creating a figure is done by applying JQuery slice() to chosen columns. The arguments (div indexes) for slice() are defined in figure templates.
* Figure collision logic is based on JQuery hasClass(), any grid div has either a background-color class or one of several Bootstrap bg-color classes.
* Side movement is controlled by the player and uses a keydown event
* Figure rotation algorithm consists of finding all moving divs' indexes, calculating the most central moving div (the pivot point), then finding all divs' relative coordinates with respect to the central div and using the rotation matrix to calculate the coordinates of rotated divs.
Note: Since JS is a synchronous language, some asynchrony in the form of Promises was added to prevent multiple figures from appearing simultaneously (see functions autoMove(), cycle() and start()).