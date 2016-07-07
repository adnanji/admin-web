		app.controller('leavePlannerCtrl', function($scope, $stateParams, $q,$mdDialog, $mdMedia,$location,$state) {

			$scope.dats = {
			 
				leaveModes:[
				{mode:"Fullday"},
				{mode:"First-half"},
				{mode:"Second-half"}
				
				]
			};
			console.log($stateParams);

			if($stateParams.activityid) {
                console.log($stateParams);

				function getActivities() {
					var defer = $q.defer();
					firebase.database().ref('/activity/'+$stateParams.userid+'/'+$stateParams.date+'/' + $stateParams.activityid).on('value', function (snapshot) {
					 if(!snapshot.val()){
						defer.reject('err no data');
					}else{
						defer.resolve(snapshot.val());
										
						}
					});
					return defer.promise;
				};

				getActivities().then(function(snap){
					$scope.leave = snap;
					console.log($scope.leave);

				}, function(err){
									
									 console.log(err);
								 });

			}

			$scope.eventplan = function(data,ev) {
				console.log(data);
				console.log($stateParams.date);
				$mdDialog.show(
					$mdDialog.alert()
					.parent(angular.element(document.querySelector('#popupContainer')))
					.clickOutsideToClose(true)
					.title('Activity added')
					.textContent('You can add more activity.')
					.ariaLabel('Alert Dialog Demo')
					.ok('OK')
					.targetEvent(ev)
					);
				$state.go("plannerMain.blank");
				
				if(!$stateParams.activityid) {
					var newPostKey = firebase.database().ref('/activity/'+$stateParams.userid + '/').child($stateParams.date).push().key;
				}
				else var newPostKey = $stateParams.activityid;
				
				var updates = {};
				updates['/activity/' + $stateParams.userid  + '/' + $stateParams.date + '/' + newPostKey + '/type'] = "leave";
				data.planning.active=true;
				updates['/activity/' + $stateParams.userid  + '/' + $stateParams.date + '/' + newPostKey + '/planning'] = data.planning;
				return firebase.database().ref().update(updates);
				
				
			};

		});