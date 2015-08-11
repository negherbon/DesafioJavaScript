/**
 *  Arquivo específico da view de veículos.
 */
$(document).ready(function() {
    $(".table-responsive .dt-bootstrap").fadeIn();
    $(".ca-form").fadeOut();

    var time = (data.vehicles == null || data.vehicles.length == 0 ? 1300 : 0);
    setTimeout(function() {
        buildOptionBrands();
        buildGrid();
        $("#table-vehicles img").css("margin-left", "35px");
        $("#table-vehicles tbody").on("click", "tr", function ()
        {
            if ($(this).hasClass("ca-table-selected"))
            {
                $(this).removeClass("ca-table-selected");
                // Desabilitando botão.
                $("#ca-btn-remove").attr("disabled", "disabled");
            }
            else 
            {
                $("#table-vehicles").dataTable().$("tr.ca-table-selected").removeClass("ca-table-selected");
                $(this).addClass("ca-table-selected");
                // Habilitando botão.
                $("#ca-btn-remove").removeAttr("disabled");
            }
        });
    }, time);
});

/**
 * Função faz a montagem da grid.
 */
function buildGrid() {
    var datatableConfig = getDefaultConfGrid();
    datatableConfig.data = data.vehicles; // Objeto global
    datatableConfig.columns = getVehiclesColumns();
    datatableConfig.order = [[2, "asc"]];

    $('#table-vehicles').dataTable(datatableConfig);
    changeSearchPosition();
}

/**
 * Função faz a montagem das opções de marcas.
 */
function buildOptionBrands() {
    for (var i = 0; i < data.brands.length; i++) {
        $("#ca-form-brand").append("<option value='" + data.brands[i].id + "'>" + data.brands[i].brand + "</option>")
    }
}

/**
 * Seletor disparado pelo botão de cancelar do formulário.
 */
$(".ca-form-buttons").on("click", ".btn-link", function() {
    $(".table-responsive .dt-bootstrap").fadeIn(500); // Toggle Grid.
    $(".ca-form").fadeOut(500); // Toggle Form.
});

/**
 * Seletor disparado pelo botão de salvar do formulário.
 */
$(".ca-form-buttons").on("click", ".btn-default", function() {
    if (validateForm()) {
        var idVehicle = $("#ca-form-id").val();
        var parseClass = $(this).parents(".ca-form").attr("parseClass");
        var parse = new Parse.Object.extend("Veiculo");
        object = new parse();

        var vehicle = new Object();
        vehicle.brand = $("#ca-form-brand").val();
        vehicle.model = $("#ca-form-model").val();
        vehicle.fuel = $("#ca-form-fuel").val();
        vehicle.plaque = $("#ca-form-plaque").val();
        vehicle.color = $("#ca-form-color").val();
        vehicle.image = $("#ca-form-image").val();

        // Salvar Parse.com
        if (idVehicle != null) {
            object.set("id", idVehicle);
            $("#ca-btn-remove").attr("disabled", "disabled");
        }
        object.set("marca", vehicle.brand);
        object.set("modelo", vehicle.model);
        object.set("combustivel", (vehicle.fuel != null ? parseInt(vehicle.fuel) : null));
        object.set("placa", vehicle.plaque);
        object.set("cor", (vehicle.color != null ? parseInt(vehicle.color) : null));
        object.set("imagem", (vehicle.image == null || vehicle.image.length == 0 ? null : vehicle.image));
        object.save(null, {
            success: function(valor) {
                getVehiclesData();

                setTimeout(function() {
                    $('#table-vehicles').DataTable().destroy();
                    buildGrid();

                    $("#ca-form-id").val("");
                    $("#ca-form-brand").val("");
                    $("#ca-form-model").val("");
                    $("#ca-form-fuel").val("");
                    $("#ca-form-plaque").val("");
                    $("#ca-form-color").val("");
                    $("#ca-form-image").val("");

                    $(".table-responsive .dt-bootstrap").fadeIn();
                    $(".ca-form").fadeOut();
                }, 1300);
            },
            error: function(valor, error) {
                alert("Falha ao criar objeto" + error.message);
            }
        });       
    }
});

/**
 * Aplica mascara no campo da placa.
 */
$("#ca-form-plaque").keypress(function(event) {
    var plaque = this.value;
    length = plaque.length + 1;
    // 000^
    if (length == 4) {
        document.getElementById("ca-form-plaque").value = plaque.substr(0, 4) + "-";
    }   
});

/**
 * Função responsável por alterar posição do elemento de busca.
 */
function changeSearchPosition() {
    var searchElement = $("#table-vehicles_filter input");
    $(".ca-action-buttons input").remove(); // Caso já exista um elemento, devido ao datatable redenrizar toda vez o elemento de busca.
    $(".ca-action-buttons").append(searchElement);
}

/**
 * Remoção de veículo.
 */
function removeItem() {
    if ($("tr.ca-table-selected").length == 0) {
        return;
    }

    var row = $('#table-vehicles').dataTable().fnGetData($('#table-vehicles').DataTable().row('.ca-table-selected'));

    $('#table-vehicles').DataTable().row('.ca-table-selected').remove().draw(false);
    var query = new Parse.Query("Veiculo"); // Classe onde estão armazenados as marcas.
    query.get(row.id.toString(), {
        success: function(results) {
            results.destroy({
              success: function(myObject) {
                    $("#ca-btn-remove").attr("disabled", "disabled");
              },
              error: function(myObject, error) {
                    alert("Erro de conexão Parse");
              }
            });
        },
        error: function(error) {
            alert("Erro de conexão com o Parse!");
            console.error(error);
        }
    });
}

/**
 * Altera de veículo.
 */
function updateItem() {
    if ($("tr.ca-table-selected").length == 0) {
        return;
    }

    var row = $('#table-vehicles').dataTable().fnGetData($('#table-vehicles').DataTable().row('.ca-table-selected'));
    var query = new Parse.Query("Veiculo"); // Classe onde estão armazenados as marcas.
    query.get(row.id.toString(), {
        success: function(results) {
            $("#ca-form-id").val(row.id.toString());
            $("#ca-form-brand").val(results.attributes.marca);
            $("#ca-form-model").val(results.attributes.modelo);
            $("#ca-form-fuel").val(results.attributes.combustivel);
            $("#ca-form-plaque").val(results.attributes.placa);
            $("#ca-form-color").val(results.attributes.cor);
            $("#ca-form-image").val(results.attributes.imagem);

            $(".table-responsive .dt-bootstrap").fadeOut();
            $(".ca-form").fadeIn();
        },
        error: function(error) {
            alert("Erro de conexão com o Parse!");
            console.error(error);
        }
    });
}