const SERIE = 1;
const PARALELO = 2;

function obter_condicoes(entradas){
	switch(entradas.configuracao){
		case SERIE : return {
						"i0"   : entradas.i0,
						"d_i0" : -1 * (entradas.v0 + entradas.R * entradas.i0) / entradas.L,
						"v0"   : entradas.v0,
						"d_v0" : entradas.i0 / entradas.C,
						"alpha": entradas.R / (2 * entradas.L),
						"omega": 1 / (Math.sqrt(entradas.L * entradas.C)),
					};
		case PARALELO: return {
						"i0"   : entradas.i0,
						"d_i0" : entradas.v0/entradas.L,
						"v0"   : entradas.v0,
						"d_v0" : -1 * (entradas.v0 / entradas.R  + entradas.i0 * entradas.L) / entradas.L,
						"alpha": 1 / (2 * entradas.R * entradas.C),
						"omega": 1 / (Math.sqrt(L * C)),
					};	       
	}	
}


function obter_resultado(variaveis){
	console.log(variaveis);
	var condicoes = {
						"x0"   :  variaveis.i0,
						"d_x0" :  variaveis.d_x0,
						"alpha":  variaveis.alpha,
						"omega":  variaveis.omega,
					};	
	var resposta = {
						"resposta_natural" : {"x" : {},"s" : {"r" :{}, "i" : {} , "c" : {},}},						 
						"omega"   : variaveis.omega,
						"alpha"   : variaveis.alpha,
					};		
							 
    if (variaveis.configuracao == SERIE){
		var principal = obter_resposta_natural(condicoes);
		condicoes.x0 = variaveis.v0;
		condicoes.d_x0 = variaveis.d_v0;
		var secundaria = obter_resposta_natural(condicoes);
		resposta.resposta_natural.x   = "\\( i _R(t) = " + principal.funcao + "\\)";	
		resposta_natural.formula      = "\\( i _R(t) = " + principal.formula + "\\)";	
		resposta.resposta_natural.s.r = "\\( v _R(t) = " + principal.multiply_R + "\\)";    	
		resposta.resposta_natural.s.i = "\\( v _I(t) = " + principal.derivativeL + "\\)";    	
		resposta.resposta_natural.s.c = "\\( v _C(t) = " + secundaria.funcao + "\\)";
		return resposta;	
    }
    if (variaveis.configuracao == PARALELO){
		var secundaria = obter_resposta_natural(condicoes);
		condicoes.x0 = variaveis.v0;
		condicoes.d_x0 = variaveis.d_v0;
		var principal = obter_resposta_natural(condicoes);
		
		resposta.resposta_natural.x   = "\\( v _R(t) = " + principal.funcao + "\\)";	
		resposta_natural.formula      = "\\( v _R(t) = " + principal.formula + "\\)";	
		resposta.resposta_natural.s.r = "\\( i _R(t) = " + principal.divided_R + "\\)";    	
		resposta.resposta_natural.s.c = "\\( i _C(t) = " + principal.derivativeC + "\\)";    	
		resposta.resposta_natural.s.i = "\\( i _I(t) = " + secundaria.funcao + "\\)";
		return resposta;	
	}
	return null;
	switch(entradas.configuracao){
		case SERIE :
					condicoes.x0 = variaveis.i0;
					condicoes.d_x0 = variaveis.d_i0; 
					resposta.resposta_natural.i = obter_resposta_natural(condicoes);
					condicoes.x0 = variaveis.v0;
					condicoes.d_x0 = variaveis.d_v0;
					resposta.resposta_natural.v = obter_resposta_natural(condicoes);
					return resposta;
		case PARALELO: 
					condicoes.x0 = variaveis.i0;
					condicoes.d_x0 = variaveis.d_i0; 
					resposta.resposta_natural.i = obter_resposta_natural(condicoes);
					condicoes.x0 = variaveis.v0;
					condicoes.d_x0 = variaveis.d_v0;
					resposta.resposta_natural.v = obter_resposta_natural(condicoes);
					return resposta;	       
	}	
}

function obter_resposta_natural(vars){

	if (vars.alpha > vars.omega){
		return super_critico(vars);
	}
	if (vars.alpha == vars.omega){
		return critico(vars);
	}
	return subamortecido(vars);

}

function super_critico(vars){
	var S1 = - vars.alpha + math.sqrt(Math.pow(vars.alpha,2) - Math.pow(vars.omega,2));
	var S2 = - vars.alpha - math.sqrt(Math.pow(vars.alpha,2) - Math.pow(vars.omega,2));
	var A1 = (vars.d_x0 - S2 * vars.x0) / (S1 - S2);
	var A2 = vars.i0 - A1;
	
	return {
		"formula"   : "A _1 e^{s _1 t} + A _2 e^{s _2 t}",
		"funcao"    : A1 + "e^{" + S1 + " t} + " + A2 + "e^{"+S2+" t}",
		"derivativeL": A1 * S1 * vars.L  +'e^{'+S1+'t} + ' + A2 * S2 * vars.L + 'e^{'+S2+'t}',
		"derivativeC": A1 * S1 * vars.C  +'e^{'+S1+'t} + ' + A2 * S2 * vars.C + 'e^{'+S2+'t}',
		"divided_R" : A1/vars.R + "e^{" + S1 + " t} + " + A2/vars.R + "e^{"+S2+" t}", 
		"multiply_R": A1*vars.R + "e^{" + S1 + " t} + " + A2*vars.R + "e^{"+S2+" t}",
 	};	
}

function critico(vars){
	var S = - vars.alpha;
	var A1 = vars.x0;
	var A2 = vars.d_x0 - S*A1;

	return {
		"formula" : "A _1 e^{st} + t e^{st}",
		"funcao"  : A1 + "e^{" + S + "t} + "+A2+"te^{" + S + "t}",
		"derivative": math.derivative(A1+'e^('+S+'*t) + '+A2+'*t*e^('+S+'*t)','t').replace('(','{').replace(')','}').replace('*',''),
		"derivativeL": "e^{" + S + "t}("+ A2 * S * vars.L + "t + "+ (A1 * S + A2)*vars.L + ")",
		"derivativeC": "e^{" + S + "t}("+ A2 * S * vars.C + "t + "+ (A1 * S + A2)*vars.C + ")",
		"divided_R" : A1/vars.R + "e^{" + S + " *t} + " +A2 / vars.R + "t*e^{" + S + " * t}", 
		"multiply_R": A1*vars.R + "e^{" + S + " *t} + " +A2 * vars.R + "t*e^{" + S + " * t}",
	};
}

function subamortecido(vars){
	var wd = math.sqrt(math.pow(vars.omega,2) - math.pow(vars.alpha,2));
	var A1 = vars.x0;
	var A2 = (vars.d_x0 + vars.alpha * A1) / wd;
	return {
		"formula" : "e^{-\\alpha t} ( B _1 cos( \\omega _d t) + B _2 sen( \\omega _d t) )",
		"funcao"  : "e^{"+(-1)*vars.alpha + "t} (" + A1 + "cos(" + wd + "t)" + A2 + "sen(" + wd + " *t))",
		"derivativeL": "e^{"(-1)*vars.alpha + "t}("+( (A2*wd -  vars.alpha * A1)*vars.L) + "cos("+wd+"t) + "+((-vars.L)*(vars.alpha*A2 + A1 *wd)) + "sen("+wd+"t))",
		"derivativeL": "e^{"(-1)*vars.alpha + "t}("+( (A2*wd -  vars.alpha * A1)*vars.C) + "cos("+wd+"t) + "+((-vars.C)*(vars.alpha*A2 + A1 *wd)) + "sen("+wd+"t))",
		"divided_R" : "e^{"+(-1)*vars.alpha + "t} (" + A1/vars.R + "cos(" + wd + "t)" + A2/vars.R + "sen(" + wd + " *t))", 
		"multiply_R": "e^{"+(-1)*vars.alpha + "t} (" + A1*vars.R + "cos(" + wd + "t)" + A2*vars.R + "sen(" + wd + " *t))",
	}
}



///// funções para controle da interface.  

$(function(){
	$('.resultado').hide();
});

$("#select_tipo").change(function(){
	var title = "";
	var image = '';
	var variable = '';
	switch($(this).val()){
		case '1': 
			title = "Circuito RLC em serie";
			image = "serie";
			break;
		case '2': 
			title = "Circuito RLC em paralelo"; 
			image= 'paralelo';
			break;
		case '3': 
			title = "Circuito RLC misto";
			image = 'misto';
			break;
	}	
	$("#rlc_data>h5").html(title);
	muda_imagem(image);		
});

function muda_imagem(nome_imagem){
	$("#circuito_img").attr('src','images/' + nome_imagem + '.jpg');
}


$("#rlc_data").submit(function(ev){
	ev.preventDefault();
	alert('parou');

	var tipo =  function(alpha, omega){
		if (alpha > omega)
			return "Supercrítico (\\(\\alpha > \\omega\\))";
		if (alpha == omega)
			return "Crítico (\\(\\alpha = \\omega\\))";
		return "Subamortecido (\\(\\alpha < \\omega\\))"
	}	

	var send = {
		"C"  : 60,//$('input[name=capacitancia]').val(),
		"R"  : 1,//$('input[name=resistencia]').val(),
		"L"  : 10,//$('input[name=indutancia]').val(),
		"i0" : 10,//$('input[name=entrada_i0]').val(),
		"v0" : 5,//$('input[name=entrada_v0]').val(),
		"configuracao" : 1,//$("#configuracao").val(),   
	};
	console.log(send);
	var sets = obter_condicoes(send);
	var result = obter_resultado(sets);

	$('#resultado').html(tipo(result.alpha, result.omega));
	$('#neper').html(result.alpha);
	$('#ressonante').html(result.omega);

	if (sets.i0 > 0 && sets.v0 > 0){
		$("#resposta_natural_i").hmtl(result.resposta_natural.i.funcao);
		$("$resposta_natural_v").html(result.resposta_natural.v.funcao);
	}else {
		$("#resposta_natural_i").hmtl(result.resposta_natural.i.formula);
		$("$resposta_natural_v").html(result.resposta_natural.v.formula);
	}

	$('.resultado').hide();
	MathJax.Hub.Queue(
			["Typeset",MathJax.Hub,$("#resposta_natural_i")[0]],
			["Typeset",MathJax.Hub,$("#resposta_natural_v")[0]],
			["Typeset",MathJax.Hub,$("#resultado")[0]],
			);
});

