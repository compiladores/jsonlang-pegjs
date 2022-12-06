fn main () <
  v x = 0;

  f (it, 0, 10) <
    x = x + it;
    f (it2, 10, 20) <
      x = x + it;
    > 
  > 
  r x;
>

v x = {
  "function": main,
  "otro": 2
}