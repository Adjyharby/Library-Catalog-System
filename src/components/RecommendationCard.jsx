import { Button, Image, Divider } from "@nextui-org/react";
import PropTypes from "prop-types";

const RecommendationCard = ({ book, onOpen }) => {
  return (
    <Button
      onPress={() => onOpen(book)}
      className="flex flex-row items-center bg-gray-100 p-20 rounded-lg shadow-lg"
    >
      <div>
        <Image
          src={book.img}
          alt="Book cover"
          className="rounded-lg object-contain min-w-20"
          width={120}
          height={120}
        />
      </div>
      <div className="flex flex-col items-center justify-center ml-[2rem] w-28">
        <h3 className="font-semibold text-gray-900 mb-2 text-sm">
          {book.title}
        </h3>
        <p className="text-xs text-gray-600">{book.author}</p>
        <div className="flex items-center justify-center space-x-2 text-small mt-1 w-full">
          <Divider orientation="vertical" />
          <div>{book.genre}</div>
          <Divider orientation="vertical" />
        </div>
      </div>
    </Button>
  );
};

RecommendationCard.propTypes = {
  book: PropTypes.shape({
    img: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    genre: PropTypes.string.isRequired,
  }).isRequired,
  onOpen: PropTypes.func.isRequired,
};

export default RecommendationCard;
