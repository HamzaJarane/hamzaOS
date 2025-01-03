import tw from 'twin.macro';

function Portfolio() {
    return (
        <div css={tw`bg-black w-full h-full cursor-text overflow-hidden rounded-b-lg select-all`}>
            <iframe
                src={"https://hamza.im"}
                referrerPolicy={"no-referrer"}
                css={tw`w-full h-full`}
                sandbox={"allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"}
            />
        </div>
    )
}

export default Portfolio;