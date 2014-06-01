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
				var atLevelAndTouchesRight = ( ( points[1][0] > obj2.getCoordinates()[0][0] && points[0][0] < obj2.getCoordinates()[0][0] ) && points[0][1] <= obj2.getCoordinates()[0][1]);
				var atLevelAndTouchesLeft = ( ( points[1][0] > obj2.getCoordinates()[1][0] && points[0][0] < obj2.getCoordinates()[1][0] ) && points[0][1] <= obj2.getCoordinates()[0][1]);

				//when on same level, check if this object rans into obj2
				if ( atLevelAndTouchesRight ) {
					this.active = true;
					console.log('touch from right', points[0][1], obj2.getCoordinates()[0][1]);
					return obj2;
					//if obj2.type = 'enemy' then die, elseif exit then win, else stopMoving
				}
				if ( atLevelAndTouchesLeft ) {
					this.active = true;
					console.log('touch from left',  points[0][1], obj2.getCoordinates()[0][1]);
					// solidLevel.pos[1] = solidLevel.pos[1] - 20;
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
			moves: (this.type !== 'obstacle'),
			active: false
		};
		return ZooPart;
	})

	// here comes the hero of the game, that is a Zoo which can move and shoot
	.factory('Hero', function(Zoo) {
		
		var theHero = angular.copy(Zoo);

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

		return Gate;
	})

	// Main controller for creating characters, handling main game events etc.

	.controller('MainCtrl', function ($scope, $document, Zoo, ZooKeeper, ZooKeeperZombie, Hero, Exit) {


		// Smaller functions for each object type
		function HeroCtrl ($element, $document, $scope) {

			myhero.node = $element;
			$document.on('keydown', function(){

				if (event.keyCode === 37) { // left movement
					var left = parseInt($element.css('left'));
					myhero.pos[0] = left;

					// Creating boundaries for the game world
					// start of boundary, left side of container
					if (left < 0 ) {
						return;
					}

					for (var z = 1; z < $scope.ZooParts.length; z++ ) {

						var contactType = myhero.checkIfCollide($scope.ZooParts[z]);

						if (contactType.type === 'obstacle') {
							return;
						}
						if (contactType.type === 'enemy' && contactType.pos[1] === myhero.pos[1]) {

							console.log('oh you died sorry');
							console.log('enemy, hero', contactType.pos[1], myhero.pos[1]);
							$element.css('opacity', 0.8);
						}
					}

					$element.css('left', left - 4);
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

						var contactType = myhero.checkIfCollide($scope.ZooParts[y]);

						if (contactType.type === 'obstacle') {
							return;
						}
						if (contactType.type === 'enemy' && contactType.pos[1] === myhero.pos[1]) {
							console.log('oh you died sorry');
							console.log('enemy, hero', contactType.pos[1], myhero.pos[1]);

							// myhero.pos[0] = 0;
							// myhero.pos[1] = 0;
							$element.css('opacity', 0.3);
							$element.css('background', 'yel');
						}
					}
					$element.css('left', left + 4);			
				}

				if (event.keyCode === 38) { // jump

					event.preventDefault();
					
					if ($element.hasClass('jump')) {
						$element.removeClass('jump');
						return;
					}

					$element.addClass('jump');

					var top = parseInt($element.css('top'));
					// elevate the object for jumping
					// myhero.pos[1] = top - 20;

					setTimeout(function() {
						$element.removeClass('jump');
					}, 800);

					// getting rid of elevation as obstacleCtrl sets new level anyway
					// myhero.pos[1] = top + 20;
				}
			});
		}

		function KeeperCtrl ($element) {
			// keeps the keepers going
			$element.addClass('moveright');
			setInterval(function(){
				if ($element.hasClass('moveright')) {
					$element.removeClass('moveright');
					return;
				}
				$element.addClass('moveright');
			}, 1200);
		}

		function ObstacleCtrl ($element, $scope, $document) {

			$document.on('keydown', function($document){
				
				var positionX = parseInt($element.css('left'));
				var positionY = parseInt($element.css('top'));
				var objPair;

				// pairing html nodes back to original their objects
				for (var z = 0; z < $scope.ZooParts.length; z++) {
					if (positionX === $scope.ZooParts[z].pos[0] && positionY === $scope.ZooParts[z].pos[1]) {
						objPair = $scope.ZooParts[z];
						positionY = positionY + objPair.size[1];
					}
				}


				if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39) {
					var solidLevel = objPair.checkIfCollide(myhero);

					if (myhero.node.hasClass('jump')) {
						myhero.pos[1] = myhero.pos[1] + 20;
					}

					if (solidLevel) {
						console.log(objPair.id, solidLevel.pos[1] + solidLevel.size[1], positionY);
						objPair.active = true;

						if (myhero.pos[1] + myhero.size[1] > positionY) {
							objPair.active = true;
							solidLevel.pos[1] = positionY - objPair.size[1];
							solidLevel.node.css('top', myhero.pos[1] - myhero.size[1]);
						}

					}

					

				}
			});

		}

		function ExitCtrl ($element, $scope) {
		}

		var myhero = new Hero('monkeyMike', 'hero', [20, 60], [100, 480], '#a87d20', HeroCtrl);

		$scope.ZooParts = [
			myhero,
			new ZooKeeper('zooKeeper', 'enemy', [30, 70], [420, 470], 'blue', KeeperCtrl),
			new ZooKeeper('zooKeeper2', 'enemy', [30, 70], [580, 210], 'blue', KeeperCtrl),
			new ZooKeeperZombie('zooKeeper3', 'enemy', [25, 60], [240, 480], 'blue', KeeperCtrl),
			new Zoo('rock1', 'obstacle', [140, 20], [230, 440], 'black', ObstacleCtrl),
			new Zoo('rock2', 'obstacle', [80, 40], [130, 500], 'black', ObstacleCtrl),
			new Zoo('rock', 'obstacle', [120, 40], [570, 500], 'black', ObstacleCtrl),
			new Zoo('rock', 'obstacle', [240, 20], [540, 280], 'black', ObstacleCtrl),
			new Zoo('rock', 'obstacle', [180, 20], [760, 420], 'black', ObstacleCtrl),
			new Exit('GoldenGate', 'exit', [40, 80], [880, 340], '#eef26b', ExitCtrl)
		];


	});
	

	
	