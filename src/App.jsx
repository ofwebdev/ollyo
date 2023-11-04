import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

// Define an array of objects containing image data
const fetchedItems = [
  { id: 1, content: "Item 1", img: "./images/image-1.webp" },
  { id: 2, content: "Item 2", img: "./images/image-2.webp" },
  { id: 3, content: "Item 3", img: "./images/image-3.webp" },
  { id: 4, content: "Item 4", img: "./images/image-4.webp" },
  { id: 5, content: "Item 5", img: "./images/image-5.webp" },
  { id: 6, content: "Item 6", img: "./images/image-6.webp" },
  { id: 7, content: "Item 7", img: "./images/image-7.webp" },
  { id: 8, content: "Item 8", img: "./images/image-8.webp" },
  { id: 9, content: "Item 9", img: "./images/image-9.webp" },
  { id: 10, content: "Item 10", img: "./images/image-10.jpeg" },
  { id: 11, content: "Item 11", img: "./images/image-11.jpeg" },
];

import addImage from "../public/images/add-photo.png";

// Custom Component
import SortableItem from "./components/SortableItem";
import Item from "./components/Item";

// NEXTUI component
import { Button, Card, Checkbox, Divider } from "@nextui-org/react";

const App = () => {
  // Initialize state variables
  const [deletedImg, setDeletedImg] = useState([]); // Stores selected images for deletion
  const [items, setItems] = useState(fetchedItems.map((i) => i.img)); // Stores image URLs for rendering
  const [activeId, setActiveId] = useState(null); // Keeps track of the active dragged item

  // Function to handle image deletion
  const handleDeleteImg = () => {
    const filteredArray1 = items.filter((item) => !deletedImg.includes(item));
    setDeletedImg([]); // Clear the selected images
    setItems(filteredArray1); // Update the list of images after deletion
  };

  // Define sensors for drag-and-drop functionality
  const sensors = useSensors(
    useSensor(MouseSensor), // Use a mouse sensor for drag-and-drop
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 8, // Set a distance constraint for touch activation
      },
    })
  );

  // Callback function for drag start
  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id); // Set the currently active dragged item
  }, []);

  // Callback function for drag end
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      // Reorder the items if the dragged item is dropped in a different location
      setItems((items) => {
        const oldIndex = items.indexOf(active?.id);
        const newIndex = items.indexOf(over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null); // Reset the active item after drag is completed
  }, []);

  // Callback function for canceling drag
  const handleDragCancel = useCallback(() => {
    setActiveId(null); // Reset the active item when dragging is canceled
  }, []);

  return (
    <div className="max-w-6xl mx-auto bg-[#fafafa]">
      <Card className="p-4 md:p-8 mx-4 md:mx-0 my-8">
        <div className="mb-3">
          {deletedImg.length === 0 ? (
            // Display a heading when no images are selected
            <h3 className="text-2xl font-semibold">Gallery</h3>
          ) : (
            // Display a header when images are selected for deletion
            <div className="flex justify-between">
              <div className="flex justify-center items-center gap-1">
                {/* Display a checkbox to select/deselect all images */}
                <Checkbox isSelected={true}></Checkbox>
                <p className="text-lg md:text-xl font-semibold">
                  {/* Display the number of selected images */}
                  Item Selected: {deletedImg.length}
                </p>
              </div>

              <div>
                {/* Display a "Delete" button to delete selected images */}
                <Button
                  onClick={handleDeleteImg}
                  color="danger"
                  variant="light"
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>

        <Divider className="mb-5" />
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={items} strategy={rectSortingStrategy}>
            {items?.length !== 0 ? (
              // Display images in a grid layout
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-max mx-auto">
                {items.map((id, index) => (
                  // Render SortableItem component for each image
                  <SortableItem
                    key={index}
                    deletedImg={deletedImg}
                    setDeletedImg={setDeletedImg}
                    index={index}
                    id={id}
                  />
                ))}
                <div className="w-[144px] flex flex-col gap-2 rounded-[10px] cursor-pointer border-2 border-dashed border-slate-300 justify-center items-center h-[144px] bg-slate-100">
                  {/* Display an "Add Images" placeholder */}
                  <img className="w-8 h-8" src={addImage} alt="" />
                  <h4>Add Images</h4>
                </div>
              </div>
            ) : (
              // Display a message when there are no images
              <div>
                <h2 className="text-5xl font-bold uppercase my-40 text-center">
                  Reload the page
                </h2>
              </div>
            )}
          </SortableContext>
          <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
            {activeId ? <Item id={activeId} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      </Card>
    </div>
  );
};

export default App;
