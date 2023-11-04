import { forwardRef, useEffect, useState } from "react";
import { Checkbox } from "@nextui-org/react";

const Item = forwardRef(
  (
    {
      id,
      index,
      deletedImg,
      setDeletedImg,
      withOpacity,
      isDragging,
      style,
      ...props
    },
    ref
  ) => {
    // State to track whether the item is being hovered over
    const [hovered, setHovered] = useState(false);

    // State to track whether the checkbox is selected
    const [selected, setSelected] = useState(deletedImg?.includes(id));

    useEffect(() => {
      // Update the selected state when deletedImg or id changes
      setSelected(deletedImg?.includes(id));
    }, [deletedImg, id]);

    // Function to handle adding/removing images from the deletedImg list
    const handleDeletedImages = () => {
      const updatedDeletedImg = [...deletedImg];
      const isCurrentlySelected = updatedDeletedImg?.includes(id);

      if (isCurrentlySelected) {
        updatedDeletedImg?.splice(updatedDeletedImg?.indexOf(id), 1);
      } else {
        updatedDeletedImg?.push(id);
      }

      setDeletedImg(updatedDeletedImg);
      setSelected(!isCurrentlySelected);
    };

    // Inline styles for the item container
    const inlineStyles = {
      opacity: withOpacity ? "0.5" : "1",
      transformOrigin: "0% 0%",
      height: `${index === 0 ? "300px" : "140px"}`,
      width: `${index === 0 ? "300px" : "140px"}`,
      borderRadius: "12px",
      gridColumn: `${index === 0 ? "1 / span 2" : ""}`,
      gridRow: `${index === 0 ? "1 / span 2" : ""}`,
      cursor: isDragging ? "grabbing" : "grab",
      backgroundColor: "#ffffff",
      display: "flex",
      justifyContent: "center",
      touchAction: "none",
      alignItems: "center",
      boxShadow: isDragging
        ? "rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px"
        : "rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px",
      transform: isDragging ? "scale(1.05)" : "scale(1)",
      ...style,
    };

    return (
      <>
        <div
          ref={ref}
          style={inlineStyles}
          {...props}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`relative hidden md:flex ${
            selected ? "border-2 border-sky-600 opacity-1" : ""
          }`}
        >
          {/* Image */}
          <img className="rounded-[10px]" src={id} alt="" />

          {
            /* Checkbox (visible when hovered or selected) */
            hovered || selected ? (
              <Checkbox
                isSelected={selected}
                name={id}
                id={id}
                className={`absolute top-2 left-2 selectedImg`}
                onValueChange={handleDeletedImages}
              ></Checkbox>
            ) : null
          }

          {/* Hover overlay (visible when hovered but not selected) */}
          {hovered && !selected && (
            <div
              className={`absolute ${
                index === 0 ? "hidden" : ""
              } rounded-[10px] inset-0 bg-black bg-opacity-50 pointer-events-none z-10`}
            ></div>
          )}
        </div>
      </>
    );
  }
);

export default Item;
