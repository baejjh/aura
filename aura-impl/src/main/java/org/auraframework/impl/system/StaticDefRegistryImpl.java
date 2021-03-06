/*
 * Copyright (C) 2013 salesforce.com, inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.auraframework.impl.system;

import java.util.Collection;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.auraframework.def.DefDescriptor;
import org.auraframework.def.DefDescriptor.DefType;
import org.auraframework.def.Definition;
import org.auraframework.def.DescriptorFilter;
import org.auraframework.impl.source.SourceFactory;
import org.auraframework.system.Source;

import com.google.common.collect.Maps;

/**
 * Immutable DefRegistry implementation, backed by a prepopulated map.
 */
public class StaticDefRegistryImpl<T extends Definition> extends DefRegistryImpl<T> {

    private static final long serialVersionUID = 1L;
    protected final Map<DefDescriptor<T>, T> defs;
    private transient SourceFactory sourceFactory = null;

    public StaticDefRegistryImpl(Set<DefType> defTypes, Set<String> prefixes, Set<String> namespaces, Collection<T> defs) {
        this(defTypes, prefixes, namespaces, Maps.<DefDescriptor<T>, T> newHashMapWithExpectedSize(defs.size()));
        for (T def : defs) {
            @SuppressWarnings("unchecked")
            DefDescriptor<T> desc = (DefDescriptor<T>) def.getDescriptor();
            this.defs.put(desc, def);
        }
    }

    public StaticDefRegistryImpl(Set<DefType> defTypes, Set<String> prefixes, Set<String> namespaces,
            Map<DefDescriptor<T>, T> defs) {
        super(defTypes, prefixes, namespaces);
        this.defs = defs;
    }

    @Override
    public T getDef(DefDescriptor<T> descriptor) {
        return defs.get(descriptor);
    }

    public void setSourceFactory(SourceFactory sourceFactory) {
        this.sourceFactory = sourceFactory;
    }

    @Override
    public boolean hasFind() {
        return true;
    }

    @Override
    public Set<DefDescriptor<?>> find(DescriptorFilter matcher) {
        Set<DefDescriptor<?>> ret = new HashSet<>();

        for (DefDescriptor<T> key : defs.keySet()) {
            if (matcher.matchDescriptor(key)) {
                ret.add(key);
            }
        }
        return ret;
    }

    @Override
    public boolean exists(DefDescriptor<T> descriptor) {
        return defs.containsKey(descriptor);
    }

    @Override
    public Source<T> getSource(DefDescriptor<T> descriptor) {
        if (sourceFactory != null) {
            return sourceFactory.getSource(descriptor);
        }
        return null;
    }

    @Override
    public boolean isCacheable() {
        return false;
    }
    
    @Override
    public boolean isStatic() {
        return true;
    }

    @Override
    public void reset() {
    }
}
