const OverlayModal = ({ content }) => {
  return (
    <section className=" w-full h-screen absolute cursor-pointer inset-0 z-50 backdrop-filter backdrop-brightness-50 flex justify-center items-center">
      <div className="xl:w-[50%] w-[90%]" onClick={(e) => e.stopPropagation()}>
        {content}
      </div>
    </section>
  );
};

export default OverlayModal;
