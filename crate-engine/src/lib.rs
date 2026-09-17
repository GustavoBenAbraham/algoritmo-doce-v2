use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn calcular_desconto(total: f64, cupom: &str) -> f64 {
    if cupom == "DEV10" {
        total * 0.90
    } else if cupom == "GLICOSE20" {
        total * 0.80
    } else {
        total
    }
}