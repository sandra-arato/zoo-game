'use strict';

angular.module('zooStoryApp')

	// creating a factory for 3 types of objects in the game:
	// hero is able to move and shoot, enemy moves only, obstacle is static
	.factory('Zoo', function() {
		function ZooPart (theId, theType, theSize, thePos, theColor) {
			this.id = theId;
			this.type = theType;
			this.size = theSize;
			this.pos = thePos;
			this.color = theColor;
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

	.factory('Hero', function(Zoo) {
		
		var theHero = angular.copy(Zoo);

		theHero.prototype = {
			shoot: function () {
				console.log('phew phew');
			}
		};

		return theHero;
	})

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

	.factory('ZooKeeperZombie', function(ZooKeeper) {
		
		var Keeper = angular.copy(ZooKeeper);

		Keeper.prototype = {
			zombieCanJump: function () {
				//do some crazy stuff here
			}
		};

		return Keeper;
	})

	.factory('Exit', function(Zoo) {
		var Gate = angular.copy(Zoo);

		Gate.prototype = {
			winGame: function () {
				console.log('You won');
				// get coordinates of gate and hero, if hero is fully inside gate, finish game
			}
		};
		return Gate;
	})

	.controller('MainCtrl', function ($scope, Zoo, ZooKeeper, ZooKeeperZombie, Hero, Exit) {

		$scope.createZoo = function () {
			console.log('hello zoo!');
		};
		$scope.createZoo();
		// console.log(Zoo);

		var myhero = new Hero('monkeyMike', 'hero', [20, 60], [10, 480], '#a87d20');

		$scope.ZooParts = [
			myhero,
			new ZooKeeper('zooKeeper', 'enemy', [30, 70], [470, 470], 'blue'),
			new ZooKeeper('zooKeeper2', 'enemy', [30, 70], [640, 210], 'blue'),
			new ZooKeeperZombie('zooKeeper3', 'enemy', [25, 60], [240, 480], 'blue'),
			new Zoo('rock', 'obstacle', [40, 40], [370, 500], 'black'),
			new Zoo('rock', 'obstacle', [80, 40], [130, 500], 'black'),
			new Zoo('rock', 'obstacle', [120, 20], [40, 310], 'black'),
			new Zoo('rock', 'obstacle', [240, 20], [540, 280], 'black'),
			new Zoo('rock', 'obstacle', [240, 20], [540, 280], 'black'),
			new Zoo('rock', 'obstacle', [180, 20], [760, 420], 'black'),
			new Exit('GoldenGate', 'exit', [40, 80], [880, 340], '#eef26b')
		];

		for (var i = 0; i < $scope.ZooParts.length; i++ ) {
			console.log($scope.ZooParts[i].id, $scope.ZooParts[i].type, $scope.ZooParts[i].pos[0], $scope.ZooParts[i].pos[1]);
			
		}
		console.log($scope.ZooParts[0].getCoordinates());

	});
	

	
	