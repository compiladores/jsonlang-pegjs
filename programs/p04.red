fn main () <
  i (x > 5) <
    i (x?= 6) <
      i ((x ?= 7) && (x < 8)) <
        x = 8;
      >
    >
  >
>
