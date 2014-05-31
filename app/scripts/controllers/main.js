// Zoo story game
// The brown object (a monkey) is the hero of the game that wants to escape from the Zoo. 
// The zookeepers are all over the place in their blue dresses, so don't run into them
// cause you'll die.
// Black objects are rocks, so you will have to jump over them to get through.
// Later you will be able to throw bananas at the zookeepers to kill them.
// Use Left-Right arrows to move, Up will jump (partly working only) and space will shoot later on.

'use strict';

angular.module('zooStoryApp')

	// creating a factory for 3 types of objects in the game:
	// obstacle is static, zookeeper is moving around, hero can move and jump and shoot

	//basic object that everything else is derived from (obstacle)
	.factory('Zoo', function() {
		function ZooPart (theId, theType, theSize, thePos, theColor, theController) {
			this.id = theId;
			this.type = theType;
			this.size = theSize;
			this.pos = thePos;
			this.color = theColor;
			this.controller = theController;
			this.getCoordinates = function () {
				var coordinates = [
					[ this.pos[0], this.pos[1] + this.size[1] ],
					[ this.pos[0] + this.size[0], this.pos[1] + this.size[1] ],
					[ this.pos[0] + this.size[0], this.pos[1] ],
					[ this.pos[0], this.pos[1] ]
				];
				return coordinates;
			};
			this.checkIfCollide = function (obj2) {
				var points = this.getCoordinates();
				if ( points[1][0] > obj2.getCoordinates()[0][0] && points[0][0] < obj2.getCoordinates()[0][0] ) {
					return obj2;
					//if obj2.type = 'enemy' then die, elseif exit then win, else stopMoving
				}
				if (points[1][0] > obj2.getCoordinates()[1][0] && points[0][0] < obj2.getCoordinates()[1][0]) {
					return obj2;
				}
				return false;
			};
		}

		ZooPart.prototype = {
			constructor: ZooPart,
			tell: function (attr) {
				console.log(attr + ' property is ' + this[attr]);
			},
			moves: (this.type !== 'obstacle')
		};
		return ZooPart;
	})

	// here comes the hero of the game, that is a Zoo which can move and shoot
	.factory('Hero', function(Zoo) {
		
		var theHero = angular.copy(Zoo);

		theHero.prototype = {
			run: function (runner) {
				// checking collision function should come here
			},
			shoot: function () {
				// detect spaceDown and create and move bullets based on that
				console.log('phew phew');
			}
		};

		return theHero;
	})

	// the zookeepers move around the zoo, waiting for the hero to run into them
	.factory('ZooKeeper', function(Zoo) {
		
		var Keeper = angular.copy(Zoo);

		// don't need it right now. maybe later.
		// Keeper.prototype = {
		// 	animateEnemy: function () {
		// 		var enemyBlock = $document.find('#game .enemy');
		// 		console.log(enemyBlock);
		// 		console.log(this.id + ' timer');
		// 	}
		// };

		return Keeper;
	})

	// a zookeeper zombie starts to throw knives once the hero comes closer than X
	// or instead of just walking it jumps as well...
	.factory('ZooKeeperZombie', function(ZooKeeper) {
		
		var KeeperZombie = angular.copy(ZooKeeper);

		KeeperZombie.prototype = {
			doCrazyStuff: function () {
				//do some crazy stuff here like jumping or throwing knives
			}
		};

		return KeeperZombie;
	})

	.factory('Exit', function(Zoo) {
		var Gate = angular.copy(Zoo);

		Gate.prototype = {
			winGame: function () {
				console.log('You won');
				// get coordinates of gate and hero, if hero is fully inside gate, finish game
				// this function might be better on the Hero object, might be more obvious...
			}
		};
		return Gate;
	})

	// Main controller for creating characters, handling main game events etc.

	.controller('MainCtrl', function ($scope, $document, Zoo, ZooKeeper, ZooKeeperZombie, Hero, Exit) {


		// Smaller functions for each object type
		function HeroCtrl ($element, $document, $scope) {
			$document.on('keydown', function(){
				// console.log(event.keyCode);
				if (event.keyCode === 37) { // left movement
					var left = parseInt($element.css('left'));
					myhero.pos[0] = left;

					// Creating boundaries for the game world
					// start of boundary, left side of container
					if (left < 0 ) {
						return;
					}
					$element.css('left', left - 4);
					// All this should go up to theHero.prototype.run function...
					for (var z = 1; z < $scope.ZooParts.length; z++ ) {
						var contactType = myhero.checkIfCollide($scope.ZooParts[z]);
						if (contactType.type === 'obstacle') {
							if ( contactType.pos[0] < $element.top ) {
								console.log('jumping over');
							};
							console.log('you ran into a rock');
							return;
						}
						if (contactType.type === 'enemy') {
							console.log('oh you died sorry');
							myhero.pos[0] = 0;
							myhero.pos[1] = 0;
							$element.css('opacity', 0.3);
							return;
						}
					}
					
					
				}
				if (event.keyCode === 39) { // right movement
					left = parseInt($element.css('left'));
					myhero.pos[0] = left;

					// Creating boundaries for the game world
					// end of boundary, 940 comes from the width of the container
					if (left > 940 - myhero.size[0]) {
						return;
					}

					for (var y = 1; y < $scope.ZooParts.length; y++ ) {
						contactType = myhero.checkIfCollide($scope.ZooParts[y]);
						console.log('rock', contactType.pos[0]);
						if (contactType.type === 'obstacle') {
							console.log('you ran into a rock');
							return;
						}
						if (contactType.type === 'enemy') {
							console.log('oh you died sorry');
							myhero.pos[0] = 0;
							myhero.pos[1] = 0;
							$element.css('opacity', 0.3);
							return;
						}
					}
					$element.css('left', left + 4);
					
					
				}
				if (event.keyCode === 38) { // jump
					event.preventDefault();
					var top = parseInt($element.css('top'));
					myhero.pos[1] = top;

					// ground boundary of gameworld, 540 comes from container height

					console.log(top);
					$element.css('top', top - 60);
					setTimeout(function() {
						top = parseInt($element.css('top'));
						myhero.pos[1] = top;
						$element.css('top', top + 60);
						if (top > 480) {
							console.log('test');
							$element.css('top', 480);
							myhero.pos[1] = 480;
							return;
						}
					}, 700);

				}
			});
		}

		function KeeperCtrl ($element) {
			// keeps the keepers going
			setInterval(function(){
				if ($element.hasClass('moveright')) {
					$element.removeClass('moveright');
					return;
				}
				$element.addClass('moveright');
			}, 1200);
		}

		function ObstacleCtrl () {
			// check if hero is above or under currently? 
			// let me know if hero hits a rock from top or bottom
		}

		function ExitCtrl ($element) {
			// testing if monkey is in the exit, if yes, display you won!!
		}

		var myhero = new Hero('monkeyMike', 'hero', [20, 60], [10, 480], '#a87d20', HeroCtrl);
		$scope.ZooParts = [
			myhero,
			new ZooKeeper('zooKeeper', 'enemy', [30, 70], [420, 470], 'blue', KeeperCtrl),
			new ZooKeeper('zooKeeper2', 'enemy', [30, 70], [580, 210], 'blue', KeeperCtrl),
			new ZooKeeperZombie('zooKeeper3', 'enemy', [25, 60], [240, 480], 'blue', KeeperCtrl),
			new Zoo('rock', 'obstacle', [40, 40], [370, 500], 'black', ObstacleCtrl),
			new Zoo('rock', 'obstacle', [80, 40], [130, 500], 'black', ObstacleCtrl),
			new Zoo('rock', 'obstacle', [120, 40], [570, 500], 'black', ObstacleCtrl),
			new Zoo('rock', 'obstacle', [240, 20], [540, 280], 'black', ObstacleCtrl),
			new Zoo('rock', 'obstacle', [180, 20], [760, 420], 'black', ObstacleCtrl),
			new Exit('GoldenGate', 'exit', [40, 80], [880, 340], '#eef26b', ExitCtrl)
		];


	});
	

	
	