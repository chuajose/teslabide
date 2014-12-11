var WebmailCtrl = function($modal, $scope, $http, $state, $stateParams,utilsWebmail){
	$scope.mensajes = "";
	$scope.maxSize = 5;
  	$scope.bigCurrentPage = 1;
  	$scope.bandejas = false;
  	$scope.select = {};//almaceno los uids de los mensaje checkeados
  	$scope.mailbox = "INBOX";
  	$scope.palabra = "";
  	//console.log('entro en WebmailCtrl');

  	if($stateParams.mailbox){

  		$scope.mailbox = $stateParams.mailbox;
  		//console.log($stateParams.mailbox);
  	}
  	
	utilsWebmail.ListarWebmail(1,$stateParams.mailbox).success(function (response) { 

		$scope.bandejas = response.bandejas;
		$scope.mensajes = response.emails;
		$scope.bigTotalItems = response.total

		//console.log(response);
	});

	
	


  	$scope.pageChanged = function(page) {
	  	$scope.currentPage = page;
	    utilsWebmail.ListarWebmail(page,'inbox').success(function (response) { 

			$scope.bandejas = response.bandejas;
			$scope.mensajes = response.emails;
			$scope.bigTotalItems = response.total
		});
    };

  
	/*$scope.hasPendingRequests = function () {
			$scope.loading = parseInt(100)-($http.pendingRequests.length*parseInt(10));
			//console.log($scope.loading);
        return $http.pendingRequests.length > 0;
    };*/

    $scope.checkImportant = function() {
    	//console.log($scope.mensajes);
    	var id=[];
    	var indices=[];
    	$.each($scope.select, function(index, val) {
    		//
    		//console.log(val);
    		if(val===true) {

    			//console.log($scope.mensajes[index]);
    		//	console.log($scope.mensajes[index].uid);
    			id.push($scope.mensajes[index].uid);
    			console.log(index);
    			indices.push(index);
    			
    		}
    		//$scope.mensajes[index].data.push({flagged : true});   
    	});


    	utilsWebmail.UpdateMail(id,'important',$stateParams.mailbox).success(function (response) { 

    	
			$.each(indices, function(key, indice) {
				//console.log(indice);
			   $scope.mensajes[indice].flagged=true;
			});
			
		});
    }



    $scope.check_read = function() {
    	//console.log($scope.mensajes);
    	var id=[];
    	var indices=[];
    	$.each($scope.select, function(index, val) {
    		//
    		//console.log(val);
    		if(val===true) {

    			//console.log($scope.mensajes[index]);
    		//	console.log($scope.mensajes[index].uid);
    			id.push($scope.mensajes[index].uid);
    			console.log(index);
    			indices.push(index);
    			
    		}
    		//$scope.mensajes[index].data.push({flagged : true});   
    	});


    	utilsWebmail.UpdateMail(id,'unread',$stateParams.mailbox).success(function (response) { 
    	
			$.each(indices, function(key, indice) {
				//console.log(indice);
			   $scope.mensajes[indice].seen=false;
			});
			
		});

    }


    $scope.check_unread = function() {
		//console.log($scope.mensajes);
		var id=[];
		var indices=[];
		$.each($scope.select, function(index, val) {
			//
			//console.log(val);
			if(val===true) {

				//console.log($scope.mensajes[index]);
			//	console.log($scope.mensajes[index].uid);
				id.push($scope.mensajes[index].uid);
				console.log(index);
				indices.push(index);
				
			}
			//$scope.mensajes[index].data.push({flagged : true});   
		});


		utilsWebmail.UpdateMail(id,'read',$stateParams.mailbox).success(function (response) { 
		
			$.each(indices, function(key, indice) {
				//console.log(indice);
			   $scope.mensajes[indice].seen=true;
			});
			
		});
    }




	$scope.buscar = function (palabra) {
		console.log(palabra);

	    utilsWebmail.SearchWebmail(palabra, $scope.bigCurrentPage,$scope.mailbox).success(function (response) { 
			$scope.mensajes      = response.emails;
			$scope.bandeja       = $stateParams.mailbox;
			$scope.mensaje       = false;
			$scope.bigTotalItems = response.total
			
		});
	};

	$scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: 'views/webmail/modal_add_mailbox.html',
            controller: WebmailCreateMailboxCtrl,
        });
    };

    $scope.refresh = function() {

    	$state.go('webmail' , $stateParams,{reload: true});

    }

}
//Vista de mensaje
var WebmailMensajeCtrl = function($scope, $http, $state, $stateParams,utilsWebmail,utilsGeneral){

	$scope.mensaje="";
	
	if(!$stateParams.id) {
		$state.go('webmail');
		return false;
	}
	$scope.mailbox = $stateParams.mailbox;
	utilsWebmail.VerMail($stateParams.id,$stateParams.mailbox).success(function (response) { 
	
		$scope.mensaje      = response.view;
		$scope.subject	= response.header.subject;
		$scope.from	= response.header.fromAddress;
		$scope.fecha	= response.header.date;
		var adjuntos =[];
		//recorro los adjuntos para añadirle los datos de icono
		$.each(response.adjuntos, function(index, val) {	

			ext = val.filePath.substr((~-val.filePath.lastIndexOf(".") >>> 0) + 2);
			val.ext=utilsGeneral.GetTextIcon(ext);

			adjuntos.push(val);
		});
		console.log(adjuntos);
		$scope.adjuntos = adjuntos;
		$scope.adjuntoslength = response.adjuntos.length;
		$scope.uid	= $stateParams.id;
	
		document.getElementById('iframe').contentWindow.updatedata($scope.mensaje);
		
	});

	//Actualizar el email (importante, leido, no leido)
	$scope.UpdateMail = function(action){
			utilsWebmail.ActionMail($scope.uid, action).success(function (response) { 
				$scope.mensajes      = response.mensajes;
				$scope.bandeja       = $stateParams.mailbox;
				$scope.bigTotalItems = response.total;
				
			});

	}

	//Eliminar el email 
	$scope.DeleteMail = function(uid) {
    	console.log(uid);
    	utilsWebmail.DeleteMail($scope.uid).success(function (response) { 
    		$state.go('webmail' , $stateParams,{reload: true});
			
		});

    }

    //Volver atras en el mensaje
    $scope.BackPage = function(){

    	window.history.back();
    }
}

//Vista de creación de mensaje
var WebmailComposeCtrl = function($scope, $http, $state, $stateParams,utilsWebmail, $timeout){
	$scope.subject  = "";
	$scope.mensaje  = "";
	$scope.from     = "";
	$scope.uid      = "";
	$scope.draft      = 0;
	var timeout     = null;
	var mensajeorig = "";

	/*
	 *  Si existe id para componer el mail, adjunto informacion para el envio del email
	 */
	if($stateParams.id) {
		
		utilsWebmail.VerMail($stateParams.id).success(function (response) { 
				if(response) {

					$scope.mensajeorig      = response.view;
					//$scope.mensaje      = response.view;
					$scope.subject	= "Re: "+response.header.subject;
					$scope.from	= response.header.fromAddress;
					$scope.fecha	= response.header.date;
					$scope.adjuntos	= response.adjuntos;
					$scope.adjuntoslength = response.adjuntos.length;
					$scope.uid	= $stateParams.id;

					document.getElementById('iframe').contentWindow.updatedata($scope.mensajeorig );

				}
				
		});
	}


	/*
	 *  Guardo los datos del borrador cada segundo despues de que cambie el cuerpo del mensaje
	 */
	var SaveBorrador = function(){
		var mensaje = $scope.mensaje+"<blockquote>"+$scope.mensajeorig+"</blockquote>";
		//Guardanmos el borrador
		utilsWebmail.EnviarMail($scope.subject,encodeURIComponent(mensaje) ,$scope.from, 1, $scope.draft).success(function (response) { 
			//if(response.error>0) $state.go('webmail' , $stateParams,{reload: true});
			$scope.draft=response.draft;
		});
	}

	/*
	 *  Compruebo si hay modificaciones en el cuerpo del mensaje para guardar el borrador
	 */
	var debounceSaveUpdates = function(newVal, oldVal) {
	    if (newVal != oldVal) {
	      if (timeout) {
	        $timeout.cancel(timeout)
	      }
	      timeout = $timeout(SaveBorrador, 1000);  // 1000 = 1 second
	      console.log("Actualizo borradoes.");
	    }
    };


	$scope.$watch('mensaje', debounceSaveUpdates);


	
	/*
	 * Envio el mail
	 */
	$scope.send = function(){
		//console.log($scope.mensaje);
		var mensaje = $scope.mensaje+"<blockquote>"+$scope.mensajeorig+"</blockquote>";
		utilsWebmail.EnviarMail($scope.subject,mensaje ,$scope.from,0,$scope.draft).success(function (response) { 

			if(response.error==0) $state.go('webmail' , $stateParams,{reload: true});
			
		});
		console.log($scope.subject);
	}

}

//Crear una nueva bandeja
var WebmailCreateMailboxCtrl = function($scope, $http, $state, $stateParams,utilsWebmail,$modalInstance){

	$scope.crear = function(){
		console.log($scope.newmailbox);
		utilsWebmail.addMailbox($scope.newmailbox).success(function (response) { 
			console.log(response);
			if(response.error==0)  $state.go('webmail' , $stateParams,{reload: true});
			$modalInstance.close();
		});
	}
}


//Vista de listado de carpetas
var WebmailMailboxesController = function($scope, $http, $state, $stateParams,utilsWebmail,$modal){
	utilsWebmail.ListarMailbox().success(function (response) { 
		$scope.bandejas= response.bandejas;
		console.log(response.bandejas);
	});

	$scope.changeMailbox = function(mailbox){

		console.log(mailbox);

		var modalInstance = $modal.open({
            templateUrl: 'views/webmail/modal.html',
            controller: function($scope){

            	$scope.mensaje = "Estas seguro de?";
            	console.log($scope.mensaje);

            	$scope.salir=function(){
            		    modalInstance.close();
            	}

            	$scope.ok=function(){
            		    modalInstance.close();
            	}
            },
        });
	}

	$scope.removeMailbox = function(mailbox){

		var modalInstance = $modal.open({
            templateUrl: 'views/webmail/modal.html',
            controller: function($scope){

            	$scope.mensaje = "Estas seguro de eliminar la bandeja "+mailbox+"?";
            	$scope.submensaje = "Se eliminarán todos los correos que contiene";
            	console.log($scope.mensaje);

            	$scope.salir=function(){
            		    modalInstance.close();
            	}

            	$scope.ok=function(){
            		utilsWebmail.DeleteMailbox(mailbox).success(function (response) { 
						console.log(mailbox);
						if(response.error==0) $state.go('webmail' , $stateParams,{reload: true});
						  //$scope.bandejas.splice(idx, 1);
					});
            		modalInstance.close();
            	}
            },
        });

		
	}
}
//Definimos los controladores
angular
    .module('bidef')
    .controller('WebmailCtrl ', WebmailCtrl)
    .controller('WebmailMensajeCtrl',WebmailMensajeCtrl)
    .controller('WebmailComposeCtrl',WebmailComposeCtrl)
    .controller('WebmailCreateMailboxCtrl',WebmailCreateMailboxCtrl)
    .controller('WebmailMailboxesController',WebmailMailboxesController)