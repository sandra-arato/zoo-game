'use strict';

angular.module('zooStoryApp')

	// creating a factory for 3 types of objects in the game:
	// hero is able to move and shoot, enemy moves only, obstacle is static

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
				console.log(points[1][0], obj2.getCoordinates()[0][0], points[0][0], obj2.getCoordinates()[0][0]);
				if ( points[1][0] > obj2.getCoordinates()[0][0] && points[0][0] < obj2.getCoordinates()[0][0] ) {
					console.log('reach from right');
					//if obj2.type = 'enemy' then die, elseif exit then win, else stopMoving
				}
				if (points[1][0] > obj2.getCoordinates()[1][0] && points[0][0] < obj2.getCoordinates()[1][0]) {
					console.log('reach from left');
				}
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
			run: function () {
				// detect ArrowKeyDown and change this.pos based on the keys pressed
				// on('keyDown', function(e) {
				// if e.key = 36 then this.pos[0]++; 
				// forEach i in (!Hero objects) {this.checkIfCollide(i)};
				// })
				console.log('run forest run');
				return 12;
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

		Keeper.prototype = {
			animateEnemy: function () {
				var enemyBlock = angular.element.find('#game .enemy');
				console.log(enemyBlock);
				console.log(this.id + ' timer');
			}
		};

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

	// Smaller controllers for each object type
	// .controller('HeroCtrl', function() {
	// 	console.log('test');
	// })
	// .controller('KeeperCtrl', function() {
	// 	console.log('test2');
	// })
	// .controller('ObstacleCtrl', function() {
	// 	console.log('test3');
	// })
	// .controller('ExitCtrl', function() {
	// 	console.log('test4');
	// })
	// Main controller for creating characters, handling main game events etc.

	.controller('MainCtrl', function ($scope, $document, Zoo, ZooKeeper, ZooKeeperZombie, Hero, Exit) {

		function HeroCtrl ($element) {
			console.log('hero');
		}

		function KeeperCtrl ($element) {
			$element.on('click', function(){
				if ($element.hasClass('moveright')) {
					$element.removeClass('moveright');
					return;
				};
				$element.addClass('moveright');
			});
		}

		function ObstacleCtrl ($element) {
			console.log('obs');
		}
		function ExitCtrl ($element) {
			console.log('exit');
		}

		var myhero = new Hero('monkeyMike', 'hero', [20, 60], [10, 480], '#a87d20', HeroCtrl);
		$scope.ZooParts = [
			myhero,
			new ZooKeeper('zooKeeper', 'enemy', [30, 70], [470, 470], 'blue', KeeperCtrl),
			new ZooKeeper('zooKeeper2', 'enemy', [30, 70], [640, 210], 'blue', KeeperCtrl),
			new ZooKeeperZombie('zooKeeper3', 'enemy', [25, 60], [240, 480], 'blue', KeeperCtrl),
			new Zoo('rock', 'obstacle', [40, 40], [370, 500], 'black', ObstacleCtrl),
			new Zoo('rock', 'obstacle', [80, 40], [130, 500], 'black', ObstacleCtrl),
			new Zoo('rock', 'obstacle', [120, 20], [40, 310], 'black', ObstacleCtrl),
			new Zoo('rock', 'obstacle', [120, 40], [570, 500], 'black', ObstacleCtrl),
			new Zoo('rock', 'obstacle', [240, 20], [540, 280], 'black', ObstacleCtrl),
			new Zoo('rock', 'obstacle', [180, 20], [760, 420], 'black', ObstacleCtrl),
			new Exit('GoldenGate', 'exit', [40, 80], [880, 340], '#eef26b', ExitCtrl)
		];

		$scope.createZoo = function () {
			console.log('hello zoo!');
			// WRITE BOUNDARY OF ZOO!!!! - so that nobody can leave the gameworld
		};
		$scope.createZoo();
		// console.log(Zoo);

		// $scope.ZooElements = angular.element('div.container div').children();
		// // var test2 = $scope.ZooElements.item(2);
		// console.log($scope.ZooElements);
		

	
		// console.log($scope.ZooParts[0].getCoordinates());

	});
	

	
	