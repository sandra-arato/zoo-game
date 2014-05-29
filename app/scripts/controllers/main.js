'use strict';

angular.module('zooStoryApp')

	// creating a factory for 3 types of objects in the game:
	// hero is able to move and shoot, enemy moves only, obstacle is static
	.factory('Zoo', function() {
		function Tester (theId, theType, theSize, thePos, theColor) {
			this.id = theId;
			this.type = theType;
			this.size = theSize;
			this.pos = thePos;
			this.color = theColor;
		}

		Tester.prototype = {
			constructor: Tester,
			tell: function (attr) {
				console.log(attr + ' property is ' + this[attr]);
			},
			moves: (this.type !== 'obstacle'),
			animateEnemy: function () {
				var enemyBlock = angular.element.find('#game .enemy');
				// setInterval( function() {
					console.log(enemyBlock);
					// if (enemyBlock.hasClass('moveright')) {
					// 	console.log('adding');
					// 	enemyBlock.addClass('moveright');
					// }
					console.log(this.id + ' timer');
				// }, 1200);
			}
		};
		return Tester;
	})

	.controller('MainCtrl', function ($scope, Zoo) {
		$scope.createZoo = function () {
			console.log('hello zoo!');
		};
		$scope.createZoo();
		// console.log(Zoo);
		$scope.ZooParts = [
			new Zoo('zooKeeper', 'enemy', [30, 70], [470, 470], 'blue'),
			new Zoo('zooKeeper2', 'enemy', [30, 70], [640, 210], 'blue'),
			new Zoo('monkeyMike', 'hero', [20, 60], [10, 480], 'red'),
			new Zoo('rock', 'obstacle', [40, 40], [370, 500], 'black'),
			new Zoo('rock', 'obstacle', [80, 40], [130, 500], 'black'),
			new Zoo('rock', 'obstacle', [120, 20], [40, 310], 'black')
		];

		for (var i = 0; i < $scope.ZooParts.length; i++ ) {
			console.log($scope.ZooParts[i].id, $scope.ZooParts[i].type, $scope.ZooParts[i].pos[0], $scope.ZooParts[i].pos[1]);
			if( $scope.ZooParts[i].type === 'enemy') {
				$scope.ZooParts[i].animateEnemy();
			}
		}


	});
	

	
	