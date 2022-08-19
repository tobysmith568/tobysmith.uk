import { FC, useMemo } from "react";

interface Props {
  dateValue: string;
}

const FormattedDate: FC<Props> = ({ dateValue }) => {
  const formattedDate = useMemo(() => {
    const date = new Date(dateValue);
    return date.toLocaleDateString("en-gb", dateFormatOptions);
  }, [dateValue]);

  return <>{formattedDate}</>;
};
export default FormattedDate;

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric"
};
