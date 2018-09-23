const SERIE = "1";
const PARALELO = "2";

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
						"omega": 1 / (Math.sqrt(entradas.L * entradas.C)),
					};	       
	}	
}


function obter_resultado(variaveis){
	var condicoes = {
						"x0"   :  variaveis.i0,
						"d_x0" :  variaveis.d_i0,
						"alpha":  variaveis.alpha,
						"omega":  variaveis.omega,
						"R"    :  variaveis.R, 
						"L"    :  variaveis.L, 
						"C"    :  variaveis.C,
						"xs"   :  variaveis.xs, 
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
		resposta.resposta_natural.x   = "\\( i (t) = " + principal.funcao + "\\)";	
		resposta.formula      		  = "\\( i (t) = " + principal.formula + "\\)";	
		resposta.resposta_natural.s.r = "\\( v _{_R}(t) = " + principal.multiply_R + "\\)";    	
		resposta.resposta_natural.s.i = "\\( v _{_I}(t) = " + principal.derivativeL + "\\)";    	
		resposta.resposta_natural.s.c = "\\( v _{_C}(t) = " + secundaria.funcao + "\\)";
		return resposta;	
    }
    if (variaveis.configuracao == PARALELO){
		var secundaria = obter_resposta_natural(condicoes);
		condicoes.x0 = variaveis.v0;
		condicoes.d_x0 = variaveis.d_v0;
		var principal = obter_resposta_natural(condicoes);
		
		resposta.resposta_natural.x   = "\\( v (t) = " + principal.funcao + "\\)";	
		resposta.formula      = "\\( v (t) = " + principal.formula + "\\)";	
		resposta.resposta_natural.s.r = "\\( i _{_R}(t) = " + principal.divided_R + "\\)";    	
		resposta.resposta_natural.s.c = "\\( i _{_C}(t) = " + principal.derivativeC + "\\)";    	
		resposta.resposta_natural.s.i = "\\( i _{_I}(t) = " + secundaria.funcao + "\\)";
		return resposta;	
	}
	
	return null;
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
	console.log(vars);

	var S1 = - vars.alpha + math.sqrt(Math.pow(vars.alpha,2) - Math.pow(vars.omega,2));
	var S2 = - vars.alpha - math.sqrt(Math.pow(vars.alpha,2) - Math.pow(vars.omega,2));
	var A1 = (vars.d_x0 - S2 * (vars.xs - vars.x0)) / (S1 - S2);
	var A2 = vars.xs - vars.x0 - A1;
    var xs = vars.xs > 0 ? vars.xs : 0;
	
	return {
		"formula"    : "A _1 e^{s _1 t} + A _2 e^{s _2 t}",
		"funcao"     : (xs ? (xs + ' + '):'') +A1 + "e^{" + S1 + " t} + " + A2 + "e^{"+S2+" t}",
		"derivativeL": (A1 * S1 * vars.L) + 'e^{' + S1 + 't} + ' + (A2 * S2 * vars.L) + 'e^{' + S2 + 't}',
		"derivativeC": (A1 * S1 * vars.C) + 'e^{' + S1 + 't} + ' + (A2 * S2 * vars.C) + 'e^{' + S2 + 't}',
		"divided_R"  : (xs ? (xs / vars.R) + " + " : '') +(A1 / vars.R) + "e^{" + S1 + " t} + " + (A2 / vars.R) + "e^{" + S2 + " t}", 
		"multiply_R" : (xs ? (xs * vars.R) + " + " : '') +(A1 * vars.R) + "e^{" + S1 + " t} + " + (A2 * vars.R) + "e^{" + S2 + " t}",
 	};	
}

function critico(vars){
	var S = - vars.alpha;
	var A1 = vars.x0 - vars.xs;
	var A2 = vars.d_x0 - S * A1;
	var xs = vars.xs > 0 ? vars.xs : '';
	return {
		"formula" : "A _1 e^{st} + t e^{st}",
		"funcao"  : (xs ? (xs + ' + '):'') +" + "+A1 + "e^{" + S + "t} + "+A2+"te^{" + S + "t}",
		"derivativeL": "e^{" + S + "t}("+ (A2 * S * vars.L) + "t + "+ (A1 * S + A2)*vars.L + ")",
		"derivativeC": "e^{" + S + "t}("+ (A2 * S * vars.C) + "t + "+ (A1 * S + A2)*vars.C + ")",
		"divided_R" : (xs ? (xs / vars.R) + " + " : '') + (A1/vars.R) + "e^{" + S + " t} + " + (A2 / vars.R) + "te^{" + S + " t}", 
		"multiply_R": (xs ? (xs * vars.R) + " + " : '') + (A1*vars.R) + "e^{" + S + " t} + " + (A2 * vars.R) + "te^{" + S + " t}",
	};
}

function subamortecido(vars){
	var wd = math.sqrt(math.pow(vars.omega,2) - math.pow(vars.alpha,2));
	var A1 = vars.x0 - vars.xs;
	var A2 = (vars.d_x0 + (vars.alpha * A1))/wd;
	var xs = vars.xs > 0 ? vars.xs : '';

	console.log({ "d_v0" : vars.d_x0 , "alpha" : vars.alpha,"omega" : vars.omega,A1, wd});
	return {
		"formula" : "e^{-\\alpha t} ( B _1 cos( \\omega _d t) + B _2 sen( \\omega _d t) )",
		"funcao"  : xs +"e^{"+((-1) * vars.alpha ) + "t} (" + A1 + "cos(" + wd + "t) + " + A2 + "sen(" + wd + " t))",
		"derivativeL": "e^{" + ((-1) * vars.alpha) + "t}("+((A2 * wd -  vars.alpha * A1)*vars.L) + "cos("+wd+"t) + "+((-vars.L)*(vars.alpha*A2 + A1 *wd)) + "sen("+wd+"t))",
		"derivativeC": "e^{" + ((-1) * vars.alpha) + "t}("+((A2 * wd -  vars.alpha * A1)*vars.C) + "cos("+wd+"t) + "+((-vars.C)*(vars.alpha*A2 + A1 *wd)) + "sen("+wd+"t))",
		"divided_R" : (xs ? (xs / vars.R) : '') + "e^{"+((-1) * vars.alpha) + "t} (" + (A1 / vars.R) + "cos(" + wd + "t) +" + (A2 / vars.R) + "sen(" + wd + " t))", 
		"multiply_R": (xs ? (xs * vars.R) : '')  + "e^{"+((-1) * vars.alpha) + "t} (" + (A1 * vars.R) + "cos(" + wd + "t) +" + (A2 * vars.R) + "sen(" + wd + " t))",
	}
}

//função para tratamento do circuito misto
function calcular_parametros(vars){
   console.log(vars);
   
   var A = vars.l1 * vars.l2;
   var B = (vars.r2 * vars.l1) + (vars.r1 * vars.l2) + (vars.r2 * vars.l2);
   var C = (vars.r1 * vars.r2) + Math.pow(vars.r2, 2);
   var delta = Math.pow(B,2) - 4 * A * C;
   var x1 = (-B + math.sqrt(delta) )/ (2 * A);
   var x2 = (-B - math.sqrt(delta) )/ (2 * A);
   var B1 = ( (vars.v / vars.l1) - ( (x1 * vars.v)/ vars.r1) ) * (1/ (x2-x1));
   var A1 = (-vars.v/ vars.r1) - B1;
   var M = (vars.r1 + vars.r2 + (vars.l1 * x1) )/ vars.r2;
   var N = (vars.r1 + vars.r2 + (vars.l1 * x2) )/ vars.r2;
   var A2 = M * A;
   var B2 = N * B;
   var eX1t = vars.r2 * (A1 - A2);
   var eX2t = vars.r2 * (B1 - B2);
   
   return {
      "vo" : eX1t + "e^{" + x1 + "t} (" + eX2t + "e^{" + x2 + "t}",
   };
   
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

	var tipo =  function(alpha, omega){
		if (alpha > omega)
			return "Supercrítico (\\(\\alpha > \\omega _0\\))";
		if (alpha == omega)
			return "Crítico (\\(\\alpha = \\omega _0\\))";
		return "Subamortecido (\\(\\alpha < \\omega _0\\))"
	}	
	var vs = $('input[name=entrada_vs]').val()

	var send = {
		"C"  : $('input[name=capacitancia]').val(),
		"R"  : $('input[name=resistencia]').val(),
		"L"  : $('input[name=indutancia]').val(),
		"i0" : $('input[name=entrada_i0]').val(),
		"v0" : $('input[name=entrada_v0]').val(),
		"configuracao" : $("#select_tipo").val(),   
	};
	console.log(send);
	var sets = obter_condicoes(send);
	sets.configuracao = send.configuracao;
	sets.R = send.R;
	sets.L = send.L;
	sets.C = send.C;
	sets.xs = $('input[name=entrada_vs]').val();
	var result = obter_resultado(sets);

	$('#resultado').html(tipo(result.alpha, result.omega));
	$('#neper').html(result.alpha);
	$('#ressonante').html(result.omega);

		$("#resposta_natural_x").html(result.resposta_natural.x).show();
		$("#resposta_natural_sr").html(result.resposta_natural.s.r).show();
		$("#resposta_natural_si").html(result.resposta_natural.s.i).show();
		$("#resposta_natural_sc").html(result.resposta_natural.s.c).show();

	$('.resultado').show();
	MathJax.Hub.Queue(
			["Typeset",MathJax.Hub,$("#resposta_natural_i")[0]],
			["Typeset",MathJax.Hub,$("#resposta_natural_v")[0]],
			["Typeset",MathJax.Hub,$("#resultado")[0]],
		);
});

