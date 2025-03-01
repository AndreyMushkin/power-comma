import React, {useState} from "react";
import styles from './Sidebar.module.css';
import {range} from "../../Utils/Range";
import {Slide} from "../../../Model/Types/Slide";
import SlidePreview from "./SlidePreview/SlidePreview";
import {AppDispatch, AppState} from "../../../Model/Store/AppStore";
import {createNewSlide} from "../../../Model/Store/Actions/Presentation/createNewSlide";
import {connect} from "react-redux";
import {changeCurrentSlide} from "../../../Model/Store/Actions/Editor/changeCurrentSlide";
import {updateSlidesSelection} from "../../../Model/Store/Actions/Editor/updateSlidesSelection";
import {AnyAction} from "redux";
import {
    moveSelectedSlidesDown,
    moveSelectedSlidesUp
} from "../../../Model/Store/Actions/Presentation/moveSelectedSlides";
import {selectSelectedSlideIds} from "../../../Model/Store/Selectors/selectSelectedSlideIds";
import {deleteSlides} from "../../../Model/Store/Actions/Presentation/deleteSlides";
import {previousSlide} from "../../../AdditionalFunctions/previousSlide";
import {nextSlide} from "../../../AdditionalFunctions/nextSlide";

type SidebarProps = {
    slides: Slide[],
    selectedSlideIds: string[],
    currentSlideId: string|null,
    createNewSlide: () => AnyAction,
    changeCurrentSlide: (id: string|null) => AnyAction,
    updateSlidesSelection: (ids: string[]) => AnyAction,
    moveSelectedSlidesUp: () => AnyAction,
    moveSelectedSlidesDown: () => AnyAction,
    deleteSlides: (ids: string[]) => AnyAction,
    showDropdownList: Function
}

function Sidebar({
    slides,
    selectedSlideIds,
    currentSlideId,
    createNewSlide,
    changeCurrentSlide,
    updateSlidesSelection,
    moveSelectedSlidesUp,
    moveSelectedSlidesDown,
    deleteSlides,
    showDropdownList
}: SidebarProps): JSX.Element {
    const [displayAddSlideButton, setDisplayAddSlideButton] = useState(false);

    function SidebarItem(props: {slide: Slide, index: number, onContextMenu: React.MouseEventHandler}): JSX.Element {
        const {slide, index, onContextMenu} = props;

        function handleSelection(e: React.MouseEvent): void {
            if (e.shiftKey) {
                if (currentSlideId) {
                    const currentSlideIndex = slides.findIndex((slide) => slide.id === currentSlideId);
                    const selectedSlideIds = slides.filter((_, i) => range(currentSlideIndex, index).includes(i)).map((slide) => slide.id);
                    updateSlidesSelection(selectedSlideIds);
                }
            } else {
                changeCurrentSlide(slide.id);
                updateSlidesSelection([slide.id]);
            }
        }

        return (
            <SlidePreview
                order={index + 1}
                slide={slide}
                isSelected={selectedSlideIds.includes(slide.id)}
                onClickHandler={handleSelection}
                onContextMenu={onContextMenu}
            />
        )
    }

    function handleDeletion(slideIds: string[]): void {
        updateSlidesSelection(selectedSlideIds.filter((id) => !slideIds.includes(id)));
        if (selectedSlideIds.length === 0 || (currentSlideId && slideIds.includes(currentSlideId))) {
            changeCurrentSlide(null);
        }
        deleteSlides(slideIds);
    }

    function showContextMenu(e: React.MouseEvent) {
        e.preventDefault();
        const id = e.currentTarget.getAttribute("data-id");
        showDropdownList([
            {
                title: "Previous slide",
                hotkey: "Ctrl + ↑",
                handler: previousSlide
            },
            {
                title: "Next slide",
                hotkey: "Ctrl + ↓",
                handler: nextSlide
            },
            {
                title: "Move selected up",
                hotkey: "Ctrl + Alt + ↑",
                handler: moveSelectedSlidesUp
            },
            {
                title: "Move selected down",
                hotkey: "Ctrl + Alt + ↓",
                handler: moveSelectedSlidesDown
            },
            {
                title: "Delete slide",
                handler: () => handleDeletion([id ? id : ""])
            },
            {
                title: "Delete selected slides",
                handler: () => handleDeletion(selectedSlideIds)
            }
        ], {x: e.clientX, y: e.clientY});
    }

    return (
        <div className={styles.sidebar}>
            <div
                onMouseEnter={() => setDisplayAddSlideButton(true)}
                onMouseLeave={() => setDisplayAddSlideButton(false)}
                className={styles.slidesContainer}
            >
                {slides.map((slide, index) => <SidebarItem key={slide.id} slide={slide} index={index} onContextMenu={showContextMenu}/>)}
                <div className={`${styles.addSlide} ${!displayAddSlideButton ? styles.hidden : ""}`} onClick={createNewSlide}>New slide</div>
            </div>
            <div className={styles.additionalInfo}>
                <span>Selected {selectedSlideIds.length} of {slides.length}</span>
            </div>
        </div>
    )
}

const mapStateToProps = (state: AppState) => {
    return {
        slides: state.present.presentation.slides,
        selectedSlideIds: state.present.selectedSlideIds,
        currentSlideId: state.present.currentSlideId
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        createNewSlide: () => dispatch(createNewSlide()),
        changeCurrentSlide: (id: string|null) => dispatch(changeCurrentSlide(id)),
        updateSlidesSelection: (ids: string[]) => dispatch(updateSlidesSelection(ids)),
        moveSelectedSlidesUp: () => dispatch(moveSelectedSlidesUp(selectSelectedSlideIds())),
        moveSelectedSlidesDown: () => dispatch(moveSelectedSlidesDown(selectSelectedSlideIds())),
        deleteSlides: (ids: string[]) => dispatch(deleteSlides(ids))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
