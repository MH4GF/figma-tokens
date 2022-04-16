import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Heading from './Heading';
import Button from './Button';
import Modal from './Modal';
import { Dispatch } from '../store';
import useManageTokens from '../store/useManageTokens';
import Tooltip from './Tooltip';
import Icon from './Icon';
import { activeTokenSetSelector, importedTokensSelector } from '@/selectors';
import Stack from './Stack';
import DiffText from './DiffText';

function ImportToken({
  name,
  value,
  oldValue,
  description,
  oldDescription,
  updateAction,
  removeToken,
  updateToken,
}: {
  name: string;
  value: string;
  oldValue?: string;
  description?: string;
  oldDescription?: string;
  updateAction: string;
  removeToken: any;
  updateToken: any;
}) {
  return (
    <Stack direction="row" justify="between" css={{ padding: '$2 $4' }}>
      <Stack direction="column" gap={1}>
        <div className="text-xs font-semibold">{name}</div>
        <Stack direction="row" align="center" gap={1}>
          <DiffText type="addition">
            {typeof value === 'object' ? JSON.stringify(value) : value}
          </DiffText>
          {oldValue ? (
            <DiffText type="deletion">
              {typeof oldValue === 'object' ? JSON.stringify(oldValue) : oldValue}
            </DiffText>
          ) : null}
        </Stack>
        {(description || oldDescription) && (
        <div className="text-xxs">
          {description}
          {' '}
          {oldDescription ? ` (before: ${oldDescription})` : ''}
        </div>
        )}
      </Stack>
      <Stack direction="row" align="center" gap={1}>
        <Tooltip variant="right" label={updateAction}>
          <button className="button button-ghost" type="button" onClick={updateToken}>
            <Icon name="add" />
          </button>
        </Tooltip>
        <Tooltip variant="right" label="Ignore">
          <button className="button button-ghost" type="button" onClick={removeToken}>
            <Icon name="trash" />
          </button>
        </Tooltip>
      </Stack>
    </Stack>
  );
}

export default function ImportedTokensDialog() {
  const dispatch = useDispatch<Dispatch>();
  const { editSingleToken, createSingleToken } = useManageTokens();
  const activeTokenSet = useSelector(activeTokenSetSelector);
  const importedTokens = useSelector(importedTokensSelector);
  const [newTokens, setNewTokens] = React.useState(importedTokens.newTokens);
  const [updatedTokens, setUpdatedTokens] = React.useState(importedTokens.updatedTokens);

  const handleCreateNewClick = () => {
    // Create new tokens according to styles
    // TODO: This should probably be a batch operation
    newTokens.forEach((token) => {
      createSingleToken({
        parent: activeTokenSet,
        name: token.name,
        value: token.value,
        options: {
          type: token.type,
          description: token.description,
        },
        shouldUpdateDocument: false,
      });
    });
    setNewTokens([]);
  };

  const handleUpdateClick = () => {
    // Go through each token that needs to be updated
    // TODO: This should probably be a batch operation
    updatedTokens.forEach((token) => {
      editSingleToken({
        parent: activeTokenSet,
        name: token.name,
        value: token.value,
        options: {
          type: token.type,
          description: token.description,
        },
        shouldUpdateDocument: false,
      });
    });
    setUpdatedTokens([]);
  };

  const handleImportAllClick = () => {
    // Perform both actions for all the tokens
    // TODO: This should probably be a batch operation
    handleUpdateClick();
    handleCreateNewClick();
  };

  const handleCreateSingleClick = (token) => {
    // Create new tokens according to styles
    createSingleToken({
      parent: activeTokenSet,
      name: token.name,
      value: token.value,
      options: {
        type: token.type,
        description: token.description,
      },
      shouldUpdateDocument: false,
    });
    setNewTokens(newTokens.filter((t) => t.name !== token.name));
  };

  const handleUpdateSingleClick = (token) => {
    // Go through each token that needs to be updated
    editSingleToken({
      parent: activeTokenSet,
      name: token.name,
      value: token.value,
      options: {
        type: token.type,
        description: token.description,
      },
      shouldUpdateDocument: false,
    });
    setUpdatedTokens(updatedTokens.filter((t) => t.name !== token.name));
  };

  const handleClose = () => {
    dispatch.tokenState.resetImportedTokens();
  };

  React.useEffect(() => {
    setNewTokens(importedTokens.newTokens);
    setUpdatedTokens(importedTokens.updatedTokens);
  }, [importedTokens.newTokens, importedTokens.updatedTokens]);

  if (!newTokens.length && !updatedTokens.length) return null;

  return (
    <Modal
      full
      title="Import Styles"
      large
      showClose
      isOpen={newTokens.length > 0 || updatedTokens.length > 0}
      close={handleClose}
    >
      <Stack direction="column" gap={4}>
        {newTokens.length > 0 && (
        <div>
          <Stack
            direction="row"
            justify="between"
            align="center"
            css={{
              marginBottom: '$4', paddingLeft: '$4', paddingRight: '$4', paddingBottom: '$2',
            }}
          >
            <Heading>New Tokens</Heading>
            <Button variant="secondary" id="button-import-create-all" onClick={handleCreateNewClick}>
              Create all
            </Button>
          </Stack>
          <div className="space-y-2 border-t border-gray-300">
            {newTokens.map((token) => (
              <ImportToken
                key={token.name}
                name={token.name}
                value={token.value}
                description={token.description}
                updateAction="Create"
                removeToken={() => setNewTokens(newTokens.filter((t) => t.name !== token.name))}
                updateToken={() => handleCreateSingleClick(token)}
              />
            ))}
          </div>
        </div>
        )}
        {updatedTokens.length > 0 && (
        <div>
          <Stack
            direction="row"
            justify="between"
            align="center"
            css={{
              marginBottom: '$4', paddingLeft: '$4', paddingRight: '$4', paddingBottom: '$2',
            }}
          >
            <Heading>Existing Tokens</Heading>
            <Button variant="secondary" id="button-import-update-all" onClick={handleUpdateClick}>
              Update all
            </Button>
          </Stack>
          <div className="space-y-2 border-t border-gray-300">
            {updatedTokens.map((token) => (
              <ImportToken
                key={token.name}
                name={token.name}
                value={token.value}
                oldValue={token.oldValue}
                description={token.description}
                oldDescription={token.oldDescription}
                updateAction="Update"
                removeToken={() => setUpdatedTokens(updatedTokens.filter((t) => t.name !== token.name))}
                updateToken={() => handleUpdateSingleClick(token)}
              />
            ))}
          </div>
        </div>
        )}
        <div className="flex justify-between p-4 border-t border-gray-300 ">
          <Button variant="secondary" id="button-import-close" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" id="button-import-all" onClick={handleImportAllClick}>
            Import all
          </Button>
        </div>
      </Stack>
    </Modal>
  );
}
