import {
  useState, useMemo, useCallback, useEffect,
} from 'react';
import { useDispatch } from 'react-redux';
import { Select, Spin, Tag } from 'antd';

import { RESPONSE_MODE } from '../constants';
import { addTag, fetchTags } from '../../store/tags/actions';

const useTags = (category = 'general', placeholder = 'Tags', maxTags = null) => {
  const dispatch = useDispatch();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const tagOptions = useMemo(() => tags.map((tag, idx) => (
    <Select.Option key={idx.toString()} value={tag.name} label={tag.name}>
      <Tag color={tag.color || 'default'}>
        {tag.name}
      </Tag>
    </Select.Option>
  )), [tags]);

  const handleTagsChange = useCallback((newTags) => {
    for (let i = 0; i < newTags.length; i += 1) {
      if (!tags.find((t) => t.name === newTags[i])) {
        // eslint-disable-next-line no-await-in-loop
        dispatch(
          addTag({ name: newTags[i], category, color: 'default' }, { silent: true }),
        ).then(({ data }) => {
          if (data) setTags((s) => [...s, data]);
        });
      }
    }
  }, [dispatch, tags, category]);

  const handleTagsSearch = useCallback(async (term) => {
    if (term.length >= 3) {
      const { data } = await dispatch(
        fetchTags({
          mode: RESPONSE_MODE.SIMPLIFIED,
          filters: [{ name: 'category', value: [category] }, { name: 'term', value: term }],
        }, { silent: true }),
      );
      if (data?.data) setTags(data.data);
    }
  }, [dispatch, category]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data } = await dispatch(fetchTags({
      mode: RESPONSE_MODE.SIMPLIFIED,
      filters: [{ name: 'category', value: [category] }],
    }, { silent: true }));
    if (data?.data) setTags(data.data);
    setLoading(false);
  }, [dispatch, category]);

  const tagRender = useCallback(({ label }) => (
    <Tag color={label.props?.color || 'default'}>
      { label.props?.children || label }
    </Tag>
  ), []);

  const component = useMemo(() => (
    <Select
      placeholder={placeholder}
      mode='tags'
      maxTagCount={maxTags}
      tagRender={tagRender}
      loading={loading}
      notFoundContent={loading ? <Spin size='small' /> : null}
      onChange={handleTagsChange}
      onSearch={handleTagsSearch}
      showArrow
    >
      {tagOptions}
    </Select>
  ), [tagOptions, tagRender, loading, handleTagsChange, handleTagsSearch, placeholder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [component, tags, loading];
};

export default useTags;
