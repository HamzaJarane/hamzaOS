import { useGeneralStore } from '@/stores/general';
import Button from '@/components/Global/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff, faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import useThemStore from '@/styles/useThemeStore';
import tw from 'twin.macro';

function StartButtons() {
    const { setDesktopStatus } = useGeneralStore();
    const { baseColor } = useThemStore();

    return (
        <div css={tw`flex justify-center items-center space-x-3`}>
            <Button onClick={() => setDesktopStatus('starting')}>
                <div css={tw`flex justify-center items-center`}>
                    <FontAwesomeIcon css={tw`w-[20px]`} icon={faPowerOff} />
                </div>
            </Button>

            <Button 
                onClick={() => window.location.assign('https://hamza.im')}
                css={[
                    baseColor !== 'green' ? tw`bg-base-600 border-base-600 shadow-base-700` :
                    tw`bg-red-600 border-red-600 shadow-red-700`
                ]}
            >
                <div css={tw`flex justify-center items-center`}>
                    <FontAwesomeIcon css={tw`w-[20px]`} icon={faMobileAlt} />
                </div>
            </Button>
        </div>
    )
}

export default StartButtons;