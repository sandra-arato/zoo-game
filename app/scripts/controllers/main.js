'use strict';

angular.module('zooStoryApp')

	// creating a factory for 3 types of objects in the game:
	// hero is able to move and shoot, enemy moves only, obstacle is static
	.factory('Zoo', function() {
		return {
			Element : function (name, type) {
				this.name = name;
				this.type = type;
				this.intro = function() {
					console.log('hello ' + this.name + ', you are a ' + this.type);
				};
				return this;
			}
		};
	})
	.controller('MainCtrl', function ($scope, Zoo) {

		$scope.createZoo = function () {
			console.log('hello zoo!');
		};
		$scope.createZoo();
		$scope.Zooer = [
			Zoo.Element('monkeyMike', 'hero'),
			Zoo.Element('zooKeeper', 'enemy'),
			Zoo.Element('zooKeeper2', 'enemy'),
			Zoo.Element('rock', 'obstacle')
		];
		console.log($scope.Zooer);
		$scope.Zooer[0].intro();
	});
	

	
	