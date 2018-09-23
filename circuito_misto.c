#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <string.h>


int main (){
double i, V, R1, R2, L1, L2, a, b, c, DELTA, X1, X2, A, B, A2, B2, M, N, aux1, eX1t, eX2t;
char Vo[150], it[] = "i(t) = ", e[2] = "e^", t[1]="t";
   
   //PASSO 1: COLETAR VALORES

   printf("\n USE PONTO, NÃO VÍRGULA!");
   printf("\n Entre com o valor de Vs: ");
   scanf ("%lf", &V);
   printf("\n Entre com o valor de R1: ");
   scanf ("%lf", &R1);
   printf("\n Entre com o valor de R2: ");
   scanf ("%lf", &R2);
   printf("\n Entre com o valor de L1: ");
   scanf ("%lf", &L1);
   printf("\n Entre com o valor de L2: ");
   scanf ("%lf", &L2);
   //printf(" %lf \n %lf \n %lf\n %lf\n %lf ", V,R1,R2,L1,L2);


   V = 7;
   R1 = 3;
   R2 = 1;
   L1 = 0.5;
   L2 = 0.2;
   //PASSO 2: CALCULAR DELTA
   
   a = L1 * L2;
   b = (R2*L1) + (R1*L2) + (R2*L2);
   c = (R1*R2) + (R2*R2) - R2;
   //printf("\n %lf %lf %lf", a, b, c); //estão saindo corretos
  
   
   DELTA = (b*b) - 4 * a * c;
      
   //printf("\n DELTA = %lf", DELTA); //saindo correto 
      
   // PASSO 3: CALCULAR X1 E X2
   X1 = (- b + sqrt(DELTA))  / (2 * a);
   X2 = (- b - sqrt(DELTA)) / (2 * a);
   
   //printf("\n x1 = %lf \n x2 = %lf ", X1, X2); // raizes saindo corretas
   
   //PASSO 4: CALCULAR A E B, M E N
   
   B = ( (V / L1) + ( (X1 * V) / R1) ) * ( 1 / ( X2 - X1));
   A = (-V / R1) - B;
   
   //printf("\n A: %lf \n B: %lf", A, B); //saindo corretos
   
   M = (R1+ R2 + (L1 * X1)) / R2;
   N = (R1+ R2 + (L1 * X2)) / R2;
       
   A2 = A * M;
   //printf("\n  A2 = %lf", A2);
   B2 = B * N;
   //printf("\n  B2 = %lf", B2);
   
   //PASSO 6: CALCULAR Vo(t)
   
   eX1t = R2 * (A - A2);
   eX2t = R2 * (B - B2);
   
   //printf("\n eX1t: %lf \n eX2t: %lf", eX1t, eX2t);
     
   printf("\nVo(t) =  %.2lfe^%.2lft +(%.2lf)e^%.2lft ", eX1t, X1, eX2t, X2); //Vo(t) = R2(A-A2) e^X1t + R2(B-B2) e^X2t => Vo(t) = eX1t e^X1t + eX2t e^X2t 
   printf("\n");
return 0;

}
