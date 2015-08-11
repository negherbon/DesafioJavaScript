/**
 *  Arquivo específico da view de marcas.
 */

$(document).ready(function() {
    $(".table-responsive .dt-bootstrap").fadeIn();
    $(".ca-form").fadeOut();

    var time = (data.brands == null || data.brands.length == 0 ? 1300 : 0);
    setTimeout(function() {
        buildGrid();
        // Seleção de rows na grid.
        $("#table-brands tbody").on("click", "tr", function ()
        {
            if ($(this).hasClass("ca-table-selected"))
            {
                $(this).removeClass("ca-table-selected");
                // Desabilitando botão.
                $("#ca-btn-remove").attr("disabled", "disabled");
            }
            else 
            {
                $("#table-brands").dataTable().$("tr.ca-table-selected").removeClass("ca-table-selected");
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
    datatableConfig.columns = getBrandsColumns();
    datatableConfig.order = [[1, "asc"]];
    datatableConfig.data = data.brands; // Objeto global

    $('#table-brands').DataTable(datatableConfig);
    changeSearchPosition();
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
        var parseClass = $(this).parents(".ca-form").attr("parseClass");
        var nameBrand = $("#ca-form-brand").val();
        var idBrand = $("#ca-form-id").val();
        var parse = new Parse.Object.extend("Marca");
        object = new parse();

        if (idBrand != null) {
            object.set("id", idBrand);
            $("#ca-btn-remove").attr("disabled", "disabled");
        }
        object.set("nome", nameBrand);
        object.save(null, {
            success: function(valor) {
                getBrandsData();

                setTimeout(function() {
                    $('#table-brands').DataTable().destroy();
                    buildGrid();
                    $("#ca-form-brand").val("");
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

function getRowById(id) {
    var index = null;

    for (var i = 0; i < data.brands.length; i++) {
        if (data.brands[i].id == id) {
            index = data.brands.indexOf(data.brands[i]);
            break;
        }
    }

    return index;
}
/**
 *  Função responsável por alterar posição do elemento de busca.
 */
function changeSearchPosition() {
    var searchElement = $("#table-brands_filter input");
    $(".ca-action-buttons input").remove();
    $(".ca-action-buttons").append(searchElement);
}

/**
 * Remoção de marca.
 */
function removeItem() {
    if ($("tr.ca-table-selected").length == 0) {
        return;
    }
    
    var row = $('#table-brands').dataTable().fnGetData($('#table-brands').DataTable().row('.ca-table-selected'));

    $('#table-brands').DataTable().row('.ca-table-selected').remove().draw(false);
    var query = new Parse.Query("Marca"); // Classe onde estão armazenados as marcas.
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
 * Altera de marca.
 */
function updateItem() {
    if ($("tr.ca-table-selected").length == 0) {
        return;
    }

    var row = $('#table-brands').dataTable().fnGetData($('#table-brands').DataTable().row('.ca-table-selected'));
    var query = new Parse.Query("Marca"); // Classe onde estão armazenados as marcas.
    query.get(row.id.toString(), {
        success: function(results) {
            $("#ca-form-id").val(row.id.toString());
            $("#ca-form-brand").val(results.attributes.nome);

            $(".table-responsive .dt-bootstrap").fadeOut();
            $(".ca-form").fadeIn();
        },
        error: function(error) {
            alert("Erro de conexão com o Parse!");
            console.error(error);
        }
    });
}