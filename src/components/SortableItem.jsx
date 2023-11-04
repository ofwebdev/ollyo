import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Item from "./Item";

// A component that wraps an item and makes it sortable
const SortableItem = (props) => {
  // Use the useSortable hook to handle sorting functionality
  const {
    isDragging, // Indicates if the item is currently being dragged
    attributes, // Attributes for managing drag and drop behavior
    listeners, // Event listeners for drag and drop
    setNodeRef, // Ref to attach to the sortable item's DOM node
    transform, // Transform properties for positioning during drag
    transition, // Transition properties for smooth animations
  } = useSortable({ id: props.id });

  // CSS styles based on drag and drop state
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  };

  // Render the sortable item, using the provided Item component
  return (
    <Item
      ref={setNodeRef}
      style={style}
      withOpacity={isDragging}
      {...props}
      {...attributes}
      {...listeners}
    />
  );
};

export default SortableItem;
