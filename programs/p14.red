fn makeFunc () <
  v name = 'Mozilla';
  fn displayName() <
    v x = 5;
  >
  r displayName;
>

v myFunc = makeFunc();
myFunc();