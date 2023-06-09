import { useCallback, useState } from 'react';
import { Input, InputGroup } from 'rsuite';
import CloseIcon from '@rsuite/icons/Close';
import EditIcon from '@rsuite/icons/Edit';
import CheckIcon from '@rsuite/icons/Check';
import { toggleToasterPush } from '../helpers/custom-hooks';

const EditableInput = ({
  defaultValue,
  onSave,
  label = null,
  placeholder = 'Write your value',
  emptyMsg = 'Input is empty',
  wrapperClassName="",
  ...inputProps
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isEditable, setIsEditable] = useState(false);

  const handleChange = useCallback(value => setInputValue(value), []);

  const onEditClick = useCallback(() => {
    setIsEditable(!isEditable);
    setInputValue(defaultValue);
  }, [defaultValue, isEditable]);

  const onSaveClick = async () => {
    const trimmed = inputValue.trim();

    if(trimmed === '') {
      toggleToasterPush('info', 'Info', `${emptyMsg}`, 'topStart', 4000);
    }

    if(trimmed !== defaultValue) {
      await onSave(trimmed)
    }
  }

  return (
    <div className={wrapperClassName}>
      {label}
      <InputGroup>
        <Input
          {...inputProps}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleChange}
          disabled={!isEditable}
        />
        <InputGroup.Button onClick={onEditClick}>
          {isEditable ? <CloseIcon /> : <EditIcon />}
        </InputGroup.Button>
        {isEditable && (
          <InputGroup.Button onClick={onSaveClick} >
            <CheckIcon />
          </InputGroup.Button>
        )}
      </InputGroup>
    </div>
  );
};

export default EditableInput;
