fn main () <
  v x = 0;

  du <
    x = x + it;
    du <
      x = x + it;
    > (x > 5)
  > (x > 5)
  r x;
>

main()