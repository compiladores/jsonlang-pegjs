fn InsertionSort(arr, begin, end)
<
    v left = begin - arr;
    v right = end - arr;
    
    f (it; left+1; right)
    <
        v key = arr[it];
        v j = it-1;
 
        w ((j > left) && (arr[j] > key))
        <
            arr[j+1] = arr[j];
            j = j-1;
        >
        arr[j+1] = key;
   >
 
   r;
>