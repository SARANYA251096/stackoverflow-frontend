import React from "react";
import { FaTag } from "react-icons/fa";
import { createUseStyles } from "react-jss";
import { BiChip } from "react-icons/bi";
import { BsNewspaper } from "react-icons/bs";

const useStyles = createUseStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

const ChipsArray = () => {
  const classes = useStyles();
  const [chipData, setChipData] = React.useState([
    { key: 0, label: "Angular" },
    { key: 1, label: "jQuery" },
    { key: 2, label: "Polymer" },
    { key: 3, label: "React" },
    { key: 4, label: "Vue.js" },
  ]);

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key)
    );
  };

  return (
    <div className={classes.root}>
      {chipData.map((data) => {
        let icon;

        if (data.label === "React") {
          icon = <FaTag />;
        } else if (data.label === "Angular") {
          icon = <BiChip />;
        } else if (data.label === "jQuery") {
          icon = <BsNewspaper />;
        }

        return (
          <div key={data.key}>
            <div className={classes.chip}>
              {icon}
              <span>{data.label}</span>
              {data.label === "React" ? (
                <span></span>
              ) : (
                <span onClick={handleDelete(data)}>X</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChipsArray;
