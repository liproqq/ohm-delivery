angular
    .module("ohm-delivery", [])
    .controller("tracking", function ($scope, $http) {
        $scope.sendData = function () {
            $http.get(`/ohms/${this.trackingId}`)
                .then((result) => {
                    if (result.data.status == "IN_DELIVERY") {
                        this.trackingData = result.data;
                        console.log(result.data)
                    } else {
                        this.errorMessage = "Your order is not yet in delivery or was finalized by the customer"
                    }
                }, (error) => {
                    this.errorMessage = 'Something went wrong.';
                });
        };
        $scope.confirmDelivery = function (status, comment) {
            if (status) {
                $http.post(`/ohms/finalize/${this.trackingId}`, { status: status, comment: comment })
                    .then((result) => {
                        this.trackingData = '';
                        this.confirmationMessage = 'Your feedback was processed. Thank you!'
                    }, (error) => {
                        this.errorMessage = 'Something went wrong.';
                    });
            }
        }
    });
