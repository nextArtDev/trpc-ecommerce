const ProductStatements = () => {
  return (
    <div className="w-full h-full flex flex-wrap gap-2 items-center justify-between">
      <span className="max-w-[120px] flex flex-col items-center justify-center gap-2">
        <span>
          <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            width="24"
            className="icon icon-material-icon-1"
            viewBox="0 0 24 24"
            //   style="display: block;"
          >
            <path
              stroke="currentColor"
              d="M10.538 1h2.926c.408 0 .763.294.859.71.43 1.976 1.459 2.96 2.906 2.96.43-.005.856-.078 1.265-.215a.953.953 0 0 1 .29-.046.755.755 0 0 1 .605.283l1.435 1.806a.88.88 0 0 1 .06.964c-.608.994-1.87 3.27-1.87 5.016 0 2.017 1.169 3.785 1.798 4.593.23.287.245.701.036 1.006l-1.43 2.115a.738.738 0 0 1-.638.321c-.111 0-.223-.018-.33-.05a6.986 6.986 0 0 0-1.963-.3c-1.463 0-2.842.562-3.478 2.114a.85.85 0 0 1-.44.478l-.564.245-.564-.245a.849.849 0 0 1-.436-.47c-.636-1.548-2.01-2.114-3.478-2.114a6.987 6.987 0 0 0-1.963.3c-.107.033-.218.05-.33.05a.738.738 0 0 1-.637-.32l-1.431-2.115a.853.853 0 0 1 .028-1.003c.629-.807 1.798-2.58 1.798-4.592 0-1.747-1.262-4.022-1.87-5.016a.88.88 0 0 1 .056-.977l1.435-1.785a.755.755 0 0 1 .604-.283c.099 0 .197.016.29.046.41.138.837.21 1.266.216 1.447 0 2.475-.998 2.906-2.96A.894.894 0 0 1 10.538 1Z"
              // clip-rule="evenodd"
            ></path>
            <path stroke="#0047BE" strokeDasharray="3 2" d="M12 4v15"></path>
          </svg>
        </span>
        <p className="text-xs text-center">
          {/* Full-grain, pebbled calf leather. Fabric lining. */}
          اصالت چرم تمامی کالا ها تایید می گردد.
        </p>
      </span>
      <span className="max-w-[120px]  flex flex-col gap-2 items-center justify-center text-center">
        <span>
          <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            width="24"
            className="icon icon-material-icon-2"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 6V2.5h-15V6m15 0v15.5h-15V6m15 0L12 10.5 4.5 6"
            ></path>
            <path
              stroke="#0047BE"
              strokeDasharray="3 2"
              d="M7.5 10v8.5h9V10"
            ></path>
            <circle
              cx="12"
              cy="6"
              r="1"
              stroke="#0047BE"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></circle>
          </svg>
        </span>
        <p className="text-xs ">پرداخت آنلاین از طریق درگاه اینترنتی امن</p>
      </span>
      <span className="max-w-[120px] flex flex-col gap-2 items-center justify-center text-center">
        <span>
          <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            width="24"
            className="icon icon-material-icon-3"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 4.5v15m0-15 4 4m-4-4h8m7 15h-15m15 0-4-4m4 4v-9m-15 9 4-4m0-7h7m-7 0v7m7-7v7m0-7 1-1m-1 8h-7"
            ></path>
            <path
              fill="#0047BE"
              d="M14.033 4.5H14h.227H14h.033ZM14.227 4.5c1.556.044 4.273.974 4.273 4.5 0-3.526 2.718-4.456 4.273-4.5H23h-.227C21.218 4.455 18.5 3.525 18.5 0c0 3.526-2.717 4.456-4.273 4.5h8.546-8.546Z"
            ></path>
          </svg>
        </span>
        <p className="text-xs ">گارانتی تعویض درصورت مغایرت، به مدت یک هفته.</p>
      </span>
    </div>
  )
}

export default ProductStatements
