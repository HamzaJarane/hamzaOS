import tw from 'twin.macro';

function Blog() {
    return (
        <div css={tw`bg-black w-full h-full cursor-text overflow-hidden rounded-b-lg select-all`}>
            <iframe
                src={"https://hamza.im/blog?no_sidebar"}
                referrerPolicy={"no-referrer"}
                css={tw`w-full h-full`}
                sandbox={"allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"}
            />
        </div>
    )
}

export default Blog;