// Dados armazenados em objetos globais.
data = new Object();
data.brands = new Array();
data.vehicles = new Array();

$(document).ready(function() {
	initializeParse();
	getBrandsData();
	getVehiclesData();
});

/**
 * Retorna array de veículos cadastrados no Parse.
 */
function getVehiclesData() {
	data.vehicles = new Array();

	var query = new Parse.Query("Veiculo"); // Classe onde estão armazenados as marcas.
	query.greaterThan(
		"modelo",""
	);
	setTimeout(function() { // Marcas não carregadas...
		query.find({
			success: function(results) {
				for (var i = 0; i < results.length; i++) {
					var vehicle = new Object();

					vehicle.id = results[i].id;
					vehicle.model = results[i].attributes.modelo;
					vehicle.fuel = getFuelByOrdinal(results[i].attributes.combustivel);
					vehicle.plaque = results[i].attributes.placa;
					vehicle.color = getColorByOrdinal(results[i].attributes.cor);
					vehicle.brandId = results[i].attributes.marca;
					vehicle.brand = getBrandNameById(vehicle.brandId);
					var src = (results[i].attributes.imagem == null ? "img/car.jpg" : results[i].attributes.imagem)
					vehicle.image = "<img class='ca-table-image' src='" + src + "'></img>";

					data.vehicles.push(vehicle);
				}
			},
			error: function(error) {
				alert("Erro de conexão com o Parse!");
				console.error(error);
			}
		});		
	}, 200);

}

/**
 * Retorna array com as colunas da grid e suas configurações.
 */
function getVehiclesColumns() {
	var columns = new Array();

	columns.push(
		{data: 'id', searchable: false, visible: false},
		{data: 'brand'},
        {data: 'model'},
        {data: 'fuel', searchable: false},
        {data: 'plaque', searchable: false},
        {data: 'color'},
        {data: 'brandId', searchable: false, visible: false},
        {data: 'image', searchable: false, orderable: false}
    );

	return columns;
}

/**
 * Retorna array de marcas cadastradas no Parse.
 */
function getBrandsData() {
	data.brands = new Array();

	var query = new Parse.Query("Marca"); // Classe onde estão armazenados as marcas.
	query.greaterThan(
		"nome",""
	);
	query.find({
		async: false,
		success: function(results) {
			for (var i = 0; i < results.length; i++) {
				data.brands.push({id: results[i].id, brand: results[i].attributes.nome});
			}
		},
		error: function(error) {
			alert("Erro de conexão com o Parse!");
			console.error(error);
		}
	});
}

/**
 * Retorna array com as colunas da grid e suas configurações.
 */
function getBrandsColumns() {
	var columns = new Array();

	columns.push(
		{data: 'id', searchable: false, visible: false},
		{data: 'brand'}
    );

	return columns;
}

/**
 *  Função retornar objeto com configurações padrões do DataTable.
 */
function getDefaultConfGrid() {
    var defConfig = new Object(); // Objeto de configuração principal.
    var defLanguageConfig = new Object(); // Objeto de configuração de textos da grid, anexado ao obj principal.

    defLanguageConfig.search = "";
    defLanguageConfig.info = "";
    defLanguageConfig.infoFiltered = "";
    defLanguageConfig.infoEmpty = "";
    defLanguageConfig.zeroRecords = "Nenhum registro encontrado";
    defLanguageConfig.searchPlaceholder = "Filtrar...";
    defLanguageConfig.paginate = {first: "Primeira", last: "Última", next: "Próximo", previous: "Anterior"};

    defConfig.iDisplayLength = 5;
    defConfig.bLengthChange = false;
    defConfig.language = defLanguageConfig;

    return defConfig;
}

/**
 * Função inicializa conexão com o Parse(storage cloud).
 */
function initializeParse() {
	Parse.initialize("vSVwHzSWlKvBPRRcALXqlQm8n0WiYM1n1uH96wzP", "nxWvyZBxeGPKWeW5rgIVT6tNQ35s6TBhqzlU39KA");
}

/**
 * Retorna nome através do id.
 */
function getBrandNameById(id) {
	var name = null;

	for (var i = 0; i < data.brands.length; i++) {
		if (data.brands[i].id == id) {
			name = data.brands[i].brand;
			break;
		}
	}

	return name;
}

/**
 * Retorna nome através do ordinal.
 */
function getFuelByOrdinal(option) {
	var name = " - ";

	switch (option) 
	{
		case 0:
			name = "Álcool";
			break;
		case 1:
			name = "Flex";
			break;
		case 2:
			name = "Gasolina";
			break;
	}

	return name;
}

/**
 * Retorna nome através do ordinal.
 */
function getColorByOrdinal(option) {
	var name = " - ";

	switch (option) 
	{
		case 0:
			name = "Branco";
			break;
		case 1:
			name = "Preto";
			break;
		case 2:
			name = "Prata";
			break;
		case 3:
			name = "Vermelho";
			break;
	}

	return name;
}

/**
 * Seletor botão de novo.
 * Toggle de layouts.
 */
$(".ca-action-buttons").on("click", "#ca-btn-new", function() 
{
	$(".table-responsive .dt-bootstrap").fadeToggle(500); // Toggle Grid.
	$(".ca-form").fadeToggle(500); // Toggle Form.
});

/**
 * Seletor botão de remoção.
 */
$(".ca-action-buttons").on("click", "#ca-btn-remove", function() 
{
	removeItem();
});

/**
 * Seletor botão de remoção.
 */
$(".ca-action-buttons").on("click", "#ca-btn-update", function() 
{
	updateItem();
});

/**
 * Função realiza a validação do formulario de cadastro.
 */
function validateForm() {
    var success = true;

    var requiereds = $(".ca-form [required]");

    for (var i = 0; i < requiereds.length; i++) {
        // Validando inputs obrigatórios
        if (requiereds[i].value == "") {
            $(requiereds[i]).parents(".form-group").addClass("has-error");
            success = false;
        } else {
            $(requiereds[i]).parents(".form-group").removeClass("has-error");
        }
    }

    return success;
}