angular
    .module('altairApp')
    	.controller("planCtrl",['$scope','mainService','$state','sweet','__env',
	        function ($scope,mainService,$state,sweet,__env) {       	
    	
			
        	$scope.domain="com.nbb.models.LutPlan.";
      
 			$scope.puserGrid = {
                dataSource: {                   
                    transport: {
                    	read:  {
                            url: __env.apiUrl()+"/core/list/LutPlan",
                            contentType:"application/json; charset=UTF-8",     
                            data: {"sort":[{field: 'id', dir: 'desc'}]},
                            type:"POST"
                        },
                        update: {
                            url: __env.apiUrl()+"/core/update/"+$scope.domain+"",
                            contentType:"application/json; charset=UTF-8",                                    
                            type:"POST",
                            complete: function(e) {
                            	$(".k-grid").data("kendoGrid").dataSource.read(); 
                    		}
                        },
                        destroy: {
                            url: __env.apiUrl()+"/core/delete/"+$scope.domain+"",
                            contentType:"application/json; charset=UTF-8",                                    
                            type:"POST"
                        },
                        create: {
                        	url: __env.apiUrl()+"/core/create/"+$scope.domain+"",
                            contentType:"application/json; charset=UTF-8",                                    
                            type:"POST",
                            complete: function(e) {
                            	$(".k-grid").data("kendoGrid").dataSource.read(); 
                    		}
                        },
                        parameterMap: function(options) {
                       	 return JSON.stringify(options);
                       }
                    },
                    schema: {
                     	data:"data",
                     	total:"total",
                     	 model: {                                	
                             id: "id",
                             fields: {   
                             	id: { editable: false,nullable: true},
                             	name: { type: "string", validation: { required: true } },
                             	price: { type: "number"},
                             	auditCount: { type: "number"},
                             	diskSize: { type: "number"},
                             	createDate: { type: "date" },
                             	isactive: { type: "boolean" }
                             }
                         }
                     },
                    pageSize: 10,
                    serverFiltering: true,
                    serverPaging: true,
                    serverSorting: true
                },
                filterable:{
	                	 mode: "row"
	                },
                sortable: true,
                resizable: true,
                toolbar: ["create"],
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                height: function () {
                    return $(window).height() - 180;
                },
                columns: [
	        	 	  {title: "#",template: "<span class='row-number'></span>", width:60},
	        	 	  { field:"id", title: "ID" },
	                  { field:"name", title: "Нэр" },
	                  { field: "price", template:"<span>#=price# ₮</span>", title:"Үнэ"},
	                  { field: "auditCount",template:"<span>#=auditCount# ш</span>", title:"Тоо"},
	                  { field: "diskSize", template:"<span>#=diskSize# MB</span>", title:"Файлын хэмжээ"},
	                  { field: "createDate", template: "#= kendo.toString(kendo.parseDate(createDate, 'yyyy-MM-dd'), 'MM/dd/yyyy') #", title:"Огноо", width: 150 },
	                  { field: "isactive", title:"Идэвхитэй эсэх", width: 150 },
                      { command: [
                            { name: "edit", text: { edit: " ", update: " ", cancel: " " } },
                            { name: "destroy", text: " " }
                        ], title: "&nbsp;", width: 110
                    }
                ],
                editable:"inline",
                dataBound: function () {
                var rows = this.items();
                  $(rows).each(function () {
                      var index = $(this).index() + 1 
                      + ($(".k-grid").data("kendoGrid").dataSource.pageSize() * ($(".k-grid").data("kendoGrid").dataSource.page() - 1));;
                      var rowLabel = $(this).find(".row-number");
                      $(rowLabel).html(index);
                  });
  	           },
                      
            };
        }
    ]);
